using AutoMapper;
using BIsleriumCW.Dtos;
using BIsleriumCW.Interfaces;
using BIsleriumCW.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BIsleriumCW.Services
{
    internal sealed class UserAuthenticationRepository : IUserAuthenticationRepository
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private ApplicationUser? _user;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly IEmailService _emailService;

        public UserAuthenticationRepository(UserManager<ApplicationUser> userManager, IMapper mapper, IConfiguration configuration, RoleManager<IdentityRole> roleManager, IHttpContextAccessor httpContextAccessor, IEmailService emailService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _configuration = configuration;
            _roleManager = roleManager;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
        }

        private async Task AssignRoleToUser(ApplicationUser user, string roleName)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }

            await _userManager.AddToRoleAsync(user, roleName);
        }

        public async Task<IdentityResult> RegisterUserAsync(UserRegistrationDto userRegistration)
        {
            var user = _mapper.Map<ApplicationUser>(userRegistration);
            var result = await _userManager.CreateAsync(user, userRegistration.Password);
            if (result.Succeeded)
            {
                // Assign "Blogger" role to the user
                await AssignRoleToUser(user, userRegistration.Role ?? "Blogger");
            }
            return result;
        }

        public async Task<IdentityResult> RegisterAdminAsync(UserRegistrationDto userRegistration)
        {
            var user = _mapper.Map<ApplicationUser>(userRegistration);
            var result = await _userManager.CreateAsync(user, userRegistration.Password);
            if (result.Succeeded)
            {
                // Assign "Blogger" role to the user
                await AssignRoleToUser(user, userRegistration.Role ?? "Admin");
            }
            return result;
        }

        public async Task<bool> ValidateUserAsync(UserLoginDto loginDto)
        {
            _user = await _userManager.FindByNameAsync(loginDto.UserName);
            var result = _user != null && await _userManager.CheckPasswordAsync(_user, loginDto.Password);
            return result;
        }

        private SigningCredentials GetSigningCredentials()
        {
            var jwtConfig = _configuration.GetSection("jwtConfig");
            var key = Encoding.UTF8.GetBytes(jwtConfig["Secret"]);
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        private async Task<List<Claim>> GetClaims()
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, _user.Id),
            new Claim("UserId", _user.Id),
            new Claim("Email", _user.Email),
            new Claim("FirstName", _user.FirstName),
            new Claim("LastName", _user.LastName),

        };
            var roles = await _userManager.GetRolesAsync(_user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            return claims;
        }

        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JwtConfig");
            var tokenOptions = new JwtSecurityToken
            (
            issuer: jwtSettings["validIssuer"],
            audience: jwtSettings["validAudience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["expiresIn"])),
            signingCredentials: signingCredentials
            );
            return tokenOptions;
        }

        public async Task<string> GenerateTokenAsync()
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims();
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        public string GetUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            return userIdClaim;
        }

        public async Task ForgotPassword(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var passwordResetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var token = ToUrlSafeBase64(passwordResetToken);
                await _emailService.SendForgotPasswordEmailAsync(user.FirstName, email, token);
            }
        }

        public async Task ResetPassword(string email, string token, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var passwordResetToken = FromUrlSafeBase64(token);
                var result = await _userManager.ResetPasswordAsync(user, passwordResetToken, password);

                ValidateIdentityResult(result);
            }
        }

        private void ValidateIdentityResult(IdentityResult result)
        {
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(x => x.Description);
                throw new Exception(errors.ToString());
            }
        }

        private static string ToUrlSafeBase64(string base64String)
        {
            return base64String.Replace('+', '-').Replace('/', '_').Replace('=', '*');
        }

        private static string FromUrlSafeBase64(string urlSafeBase64String)
        {
            return urlSafeBase64String.Replace('-', '+').Replace('_', '/').Replace('*', '=');
        }

        public async Task ChangePassowrd(string currentPassword, string newPassword, string userId)
        {
            string getCurrentUserId = userId;
            var user = await _userManager.FindByIdAsync(getCurrentUserId);
            if (user != null)
            {
                var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
                ValidateIdentityResult(result);
            }
        }
    }
}
