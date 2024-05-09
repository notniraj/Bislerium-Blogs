using BIsleriumCW.Data;
using BIsleriumCW.Interfaces;
using BIsleriumCW.Migrations;
using BIsleriumCW.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;
using System.Data;

namespace BIsleriumCW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly BisleriumDbContext _dbContext;
        private readonly IUserAuthenticationRepository _userAuthenticationRepository;
        //private IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        public BlogController(BisleriumDbContext dbContext, UserManager<ApplicationUser> userManager, IUserAuthenticationRepository userAuthenticationRepository)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _userAuthenticationRepository = userAuthenticationRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBlog(Blog request)
        {
            //var user = await _userManager.GetUserAsync(User);

            //if (user == null)
            //{
            //    return Unauthorized();
            //}

            var AddBlog = new Blog()
            {
                BlogTitle = request.BlogTitle,
                BlogDescription = request.BlogDescription,
                BlogImageUrl = request.BlogImageUrl,
                //UserId = _userAuthenticationRepository.GetUserId(),
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpVote = 0,
                DownVote = 0,
                Popularity = 0.0,
                IsDeleted = false
            };
            // Console.WriteLine(_userAuthenticationRepository.GetUserId());
            await _dbContext.Blogs.AddAsync(AddBlog);
            await _dbContext.SaveChangesAsync();

            return Ok(AddBlog);
        }

        [HttpGet]
        [Route("GetBlog/{id}")]
        public async Task<IActionResult> GetBlog(int id)
        {
            try
            {
                var blog = await _dbContext.Blogs
                                           .Include(b => b.User) // Include the User navigation property
                                           .FirstOrDefaultAsync(b => b.BlogID == id);

                if (blog == null)
                {
                    return NotFound(); // Blog not found
                }

                var userObject = new
                {
                    UserId = blog.User.Id,
                    UserName = blog.User.UserName,
                    Email = blog.User.Email
                };

                var response = new
                {
                    BlogId = blog.BlogID,
                    BlogTitle = blog.BlogTitle,
                    BlogDescription = blog.BlogDescription,
                    BlogImageUrl = blog.BlogImageUrl,
                    CreatedAt = blog.CreatedAt,
                    UpdatedAt = blog.UpdatedAt,
                    UpVote = blog.UpVote,
                    DownVote = blog.DownVote,
                    Popularity = blog.Popularity,
                    IsDeleted = blog.IsDeleted,
                    User = userObject
                };

                return Ok(response); // Return the blog with user details
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching the blog."); // Return an error response
            }
        }


        //This Get method is to list all the available Blog in the SYSTEM.
        [HttpGet]
        [Route("ListBlogs")]
        public async Task<IActionResult> GetBlogs()
        {
            try
            {
                var blogs = await _dbContext.Blogs
                                             .Include(b => b.User) // Include the User navigation property
                                             .Select(b => new
                                             {
                                                 b.BlogID,
                                                 b.BlogTitle,
                                                 b.BlogDescription,
                                                 b.BlogImageUrl,
                                                 b.CreatedAt,
                                                 b.UpdatedAt,
                                                 b.UpVote,
                                                 b.DownVote,
                                                 b.Popularity,
                                                 b.IsDeleted,
                                                 User = new
                                                 {
                                                     UserId = b.User.Id,
                                                     UserName = b.User.UserName,
                                                     Email = b.User.Email
                                                 }
                                             })
                                             .ToListAsync();

                return Ok(blogs); // Return the list of blogs with user details
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching the blogs."); // Return an error response
            }
        }



        //Switch IsDeleted into true / into false
        [HttpPut]
        [Route("ToggleDelete/{id}")]
        public async Task<IActionResult> ToggleDelete(int id)
        {
            var blog = await _dbContext.Blogs.FindAsync(id);

            if (blog == null)
            {
                return NotFound(); // Blog not found
            }

            // Toggle the IsDeleted property
            blog.IsDeleted = !blog.IsDeleted;
            await _dbContext.SaveChangesAsync();

            return Ok(blog); // Return the updated blog
        }

        //Update Blog
        [HttpPut]
        [Route("UpdateBlog/{id}")]
        public async Task<IActionResult> UpdateBlog(int id, Blog updatedBlog)
        {
            var blog = await _dbContext.Blogs.FindAsync(id);

            if (blog == null)
            {
                return NotFound(); // Blog not found
            }

            // Update the properties of the existing blog with the values from the updatedBlog
            blog.BlogTitle = updatedBlog.BlogTitle ?? blog.BlogTitle;
            blog.BlogDescription = updatedBlog.BlogDescription ?? blog.BlogDescription;
            blog.BlogImageUrl = updatedBlog.BlogImageUrl ?? blog.BlogImageUrl;
            //blog.UpVote = updatedBlog.UpVote;
            //blog.DownVote = updatedBlog.DownVote;
            //blog.Popularity = updatedBlog.Popularity;

            // Set the UpdatedAt timestamp to the current date and time
            blog.UpdatedAt = DateTime.Now;

            // Save the changes to the database
            await _dbContext.SaveChangesAsync();

            return Ok(blog); // Return the updated blog
        }

        [HttpGet]
        [Route("ListActiveBlogs")]
        public async Task<IActionResult> GetActiveBlogs()
        {
            try
            {
                var activeBlogs = await _dbContext.Blogs
                                                  .Where(blog => !blog.IsDeleted) // Filter where IsDeleted is false
                                                  .Include(blog => blog.User) // Include the User navigation property
                                                  .Select(blog => new
                                                  {
                                                      blog.BlogID,
                                                      blog.BlogTitle,
                                                      blog.BlogDescription,
                                                      blog.BlogImageUrl,
                                                      blog.CreatedAt,
                                                      blog.UpdatedAt,
                                                      blog.UpVote,
                                                      blog.DownVote,
                                                      blog.Popularity,
                                                      blog.IsDeleted,
                                                      User = new
                                                      {
                                                          UserId = blog.User.Id,
                                                          UserName = blog.User.UserName,
                                                          Email = blog.User.Email
                                                      }
                                                  })
                                                  .ToListAsync();

                return Ok(activeBlogs); // Return the list of active blogs with user details
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching the active blogs."); // Return an error response
            }
        }

        [HttpGet]
        [Route("ListRandomActiveBlogs")]
        public async Task<IActionResult> GetRandomActiveBlogs()
        {
            try
            {
                var activeBlogs = await _dbContext.Blogs
                                                  .Where(blog => !blog.IsDeleted) // Filter where IsDeleted is false
                                                  .Include(blog => blog.User) // Include the User navigation property
                                                  .OrderBy(o => Guid.NewGuid()) // Randomize the order
                                                  .Select(blog => new
                                                  {
                                                      blog.BlogID,
                                                      blog.BlogTitle,
                                                      blog.BlogDescription,
                                                      blog.BlogImageUrl,
                                                      blog.CreatedAt,
                                                      blog.UpdatedAt,
                                                      blog.UpVote,
                                                      blog.DownVote,
                                                      blog.Popularity,
                                                      blog.IsDeleted,
                                                      User = new
                                                      {
                                                          UserId = blog.User.Id,
                                                          UserName = blog.User.UserName,
                                                          Email = blog.User.Email
                                                      }
                                                  })
                                                  .ToListAsync();

                return Ok(activeBlogs); // Return the list of random active blogs with user details
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching the random active blogs."); // Return an error response
            }
        }

        [HttpGet]
        [Route("ListActiveBlogsByPopularity")]
        public async Task<IActionResult> GetActiveBlogsByPopularity()
        {
            try
            {
                var activeBlogs = await _dbContext.Blogs
                                                  .Where(blog => !blog.IsDeleted) // Filter where IsDeleted is false
                                                  .Include(blog => blog.User) // Include the User navigation property
                                                  .OrderByDescending(blog => blog.Popularity) // Order by Popularity (highest to lowest)
                                                  .Select(blog => new
                                                  {
                                                      blog.BlogID,
                                                      blog.BlogTitle,
                                                      blog.BlogDescription,
                                                      blog.BlogImageUrl,
                                                      blog.CreatedAt,
                                                      blog.UpdatedAt,
                                                      blog.UpVote,
                                                      blog.DownVote,
                                                      blog.Popularity,
                                                      blog.IsDeleted,
                                                      User = new
                                                      {
                                                          UserId = blog.User.Id,
                                                          UserName = blog.User.UserName,
                                                          Email = blog.User.Email
                                                      }
                                                  })
                                                  .ToListAsync();

                return Ok(activeBlogs); // Return the list of active blogs by popularity with user details
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching the active blogs by popularity."); // Return an error response
            }
        }


        [HttpPut]
        [Route("Upvote/{id}")]
        public async Task<IActionResult> Upvote(int id)
        {
            var blog = await _dbContext.Blogs.FindAsync(id);

            if (blog == null)
            {
                return NotFound(); // Blog not found
            }

            // Increment the UpVote count
            blog.UpVote++;

            // Save the changes to the database
            await _dbContext.SaveChangesAsync();

            return Ok(blog); // Return the updated blog
        }
    }
}