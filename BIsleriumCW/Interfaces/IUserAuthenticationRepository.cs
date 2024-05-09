using BIsleriumCW.Dtos;
using BIsleriumCW.Models;
using Microsoft.AspNetCore.Identity;

namespace BIsleriumCW.Interfaces
{
    public interface IUserAuthenticationRepository
    {
        Task<IdentityResult> RegisterUserAsync(UserRegistrationDto userForRegistration);
        Task<bool> ValidateUserAsync(UserLoginDto loginDto);
        Task<string> GenerateTokenAsync();
        public string GetUserId();
    }
} 
