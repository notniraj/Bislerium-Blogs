using BIsleriumCW.Data;
using BIsleriumCW.Interfaces;
using BIsleriumCW.Models;
using BIsleriumCW.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

namespace BIsleriumCW.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly BisleriumDbContext _dbContext;
        private readonly IUserAuthenticationRepository _userAuthenticationRepository;
        //private IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(BisleriumDbContext dbContext, UserManager<ApplicationUser> userManager, IUserAuthenticationRepository userAuthenticationRepository)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _userAuthenticationRepository = userAuthenticationRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPut]
        [Route("UpdateUser/{UserId}")]
        public async Task<IActionResult> UpdateUser(ApplicationUser updatedUser, String UserId)
        {
            var userID = UserId;
            Console.WriteLine(userID);
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return NotFound(); // User not found
            }

            // Update the properties of the existing user with the values from the updatedUser
            user.FirstName = updatedUser.FirstName ?? user.FirstName;
            user.LastName = updatedUser.LastName ?? user.LastName;
            user.Email = updatedUser.Email ?? user.Email;
            user.PhoneNumber = updatedUser.PhoneNumber ?? user.PhoneNumber;
            user.UserName = updatedUser.UserName ?? user.UserName;

            try
            {
                // Update user in the database
                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    // If the update operation fails, return error messages
                    return BadRequest(result.Errors);
                }

                return Ok(user); // Return the updated user
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("ChangePassword/")]
        public async Task<IActionResult> ChangePassword(string oldPassword, string newPassword, String UserId)
        {
            var userID = UserId;/*_userAuthenticationRepository.GetUserId();*/
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return NotFound(); // User not found
            }

            // Change password using UserManager
            var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);

            if (!result.Succeeded)
            {
                // If the change password operation fails, return error messages
                return BadRequest(result.Errors);
            }

            return Ok("Password changed successfully");
        }


        [HttpDelete]
        [Route("DeleteUser/")]
        public async Task<IActionResult> DeleteUser(String UserId)
        {
            var userID = UserId;/*_userAuthenticationRepository.GetUserId();*/
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return NotFound(); // User not found
            }

            try
            {
                // Delete user from the database
                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    // If the delete operation fails, return error messages
                    return BadRequest(result.Errors);
                }

                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetUser/{Id}")]
        public async Task<IActionResult> GetUserById(String Id)
        {
            //var userID = _userAuthenticationRepository.GetUserId();
            var userID = Id;
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return NotFound(); // User not found
            }

            return Ok(user);
        }

    }

}
