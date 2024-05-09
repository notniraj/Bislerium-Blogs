using BIsleriumCW.Data;
using BIsleriumCW.Interfaces;
using BIsleriumCW.Models;
using BIsleriumCW.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    }

}
