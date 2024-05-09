using BIsleriumCW.Data;
using BIsleriumCW.Models;
using Microsoft.AspNetCore.Mvc;

namespace BIsleriumCW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogReactionController : ControllerBase
    {
        private readonly BisleriumDbContext dbContext;
        public BlogReactionController(BisleriumDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

    }
}
