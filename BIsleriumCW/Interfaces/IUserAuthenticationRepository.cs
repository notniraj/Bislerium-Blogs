using BIsleriumCW.Dtos;
using BIsleriumCW.Models;
using Microsoft.AspNetCore.Identity;

namespace BIsleriumCW.Interfaces
{
    public interface IUserAuthenticationRepository
    {
        Task<IdentityResult> RegisterUserAsync(UserRegistrationDto userForRegistration);

        Task<IdentityResult> RegisterAdminAsync(UserRegistrationDto userForRegistration);
        Task<bool> ValidateUserAsync(UserLoginDto loginDto);
        Task<string> GenerateTokenAsync();
        public string GetUserId();

        Task ForgotPassword(string email);
        Task ChangePassowrd(string currentPassword, string newPassword);
        Task ResetPassword(string email, string token, string password);
    }
} 
