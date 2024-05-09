using AutoMapper;
using BIsleriumCW.Dtos;
using BIsleriumCW.Filters;
using BIsleriumCW.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BIsleriumCW.Controllers
{
    [Route("api/user-authentication")]
    [ApiController]
    public class AuthController : BaseApiController
    {
        public AuthController(IRepositoryManager repository, IMapper mapper) : base(repository, mapper)
        {
        }

        [HttpPost]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDto userRegistration)
        {

            var userResult = await _repository.UserAuthentication.RegisterUserAsync(userRegistration);
            return !userResult.Succeeded ? new BadRequestObjectResult(userResult) : StatusCode(201);
        }

        [HttpPost("login")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> Authenticate([FromBody] UserLoginDto user)
        {
            return !await _repository.UserAuthentication.ValidateUserAsync(user)
                ? Unauthorized()
                : Ok(new { Token = await _repository.UserAuthentication.GenerateTokenAsync() });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            await _repository.UserAuthentication.ForgotPassword(email);
            return Ok("Password reset email sent successfully.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(string email, string token, string newPassword)
        {
            await _repository.UserAuthentication.ResetPassword(email, token, newPassword);
            return Ok("Password reset successful.");
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassowrd(string currentPassword, string newPassword)
        {
            await _repository.UserAuthentication.ChangePassowrd(currentPassword, newPassword);
            return Ok("Password changed successfully.");
        }
    }
}
