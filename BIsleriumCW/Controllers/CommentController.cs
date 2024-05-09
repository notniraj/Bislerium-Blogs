using BIsleriumCW.Data;
using BIsleriumCW.Interfaces;
using BIsleriumCW.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BIsleriumCW.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly BisleriumDbContext dbContext;
        private readonly IUserAuthenticationRepository _userAuthenticationRepository;

        public CommentController(BisleriumDbContext dbContext, IUserAuthenticationRepository userAuthenticationRepository)
        {
            this.dbContext = dbContext;
            this._userAuthenticationRepository = userAuthenticationRepository;
        }

        [HttpPost]
        [Route("CreateComment")]
        public async Task<IActionResult> CreateComment(Comment request)
        {
            try
            {
                var newComment = new Comment()
                {
                    Comments = request.Comments,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    BlogId = request.BlogId, // Assuming you want to associate the comment with a specific blog
                    UserId = _userAuthenticationRepository.GetUserId()
                };

                dbContext.Comments.Add(newComment);
                await dbContext.SaveChangesAsync();

                return Ok(newComment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while creating the comment."); // Return an error response
            }
        }


        [HttpPut]
        [Route("UpdateComment/{id}")]
        public async Task<IActionResult> UpdateComment(int id, Comment updatedComment)
        {
            try
            {
                var existingComment = await dbContext.Comments.FindAsync(id);

                if (existingComment == null)
                {
                    return NotFound(); // Return 404 Not Found if the comment doesn't exist
                }

                // Update the properties of the existing comment with the values from the updatedComment
                existingComment.Comments = updatedComment.Comments ?? existingComment.Comments;

                existingComment.UpdatedAt = DateTime.UtcNow;

                // Save the changes to the database
                await dbContext.SaveChangesAsync();

                return Ok(existingComment); // Return the updated comment
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while updating the comment."); // Return an error response
            }
        }

        [HttpDelete]
        [Route("DeleteComment/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var comment = await dbContext.Comments.FindAsync(id);

                if (comment == null)
                {
                    return NotFound(); // Return 404 Not Found if the comment doesn't exist
                }

                dbContext.Comments.Remove(comment);
                await dbContext.SaveChangesAsync();

                return NoContent(); // Return 204 No Content indicating successful deletion
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while deleting the comment."); // Return an error response
            }
        }

        [HttpGet]
        [Route("GetCommentsByBlogId/{blogId}")]
        public async Task<IActionResult> GetCommentsByBlogId(int blogId)
        {
            try
            {
                var comments = await dbContext.Comments
                                              .Where(comment => comment.BlogId == blogId)
                                              .Include(comment => comment.User) // Include the User navigation property
                                              .Select(comment => new
                                              {
                                                  comment.CommentId,
                                                  comment.Comments,
                                                  User = new
                                                  {
                                                      UserId = comment.User.Id,
                                                      UserName = comment.User.UserName,
                                                      Email = comment.User.Email
                                                  },
                                                  Blog = new
                                                  {
                                                      BlogId = comment.Blog.BlogID,
                                                      BlogTitle = comment.Blog.BlogTitle
                                                  }
                                              })
                                              .ToListAsync();

                return Ok(comments); // Return comments associated with the specified blog with user details
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching comments."); // Return an error response
            }
        }



        [HttpGet]
        [Route("GetComment/{id}")]
        public async Task<IActionResult> GetComment(int id)
        {
            try
            {
                var comment = await dbContext.Comments.FindAsync(id);

                if (comment == null)
                {
                    return NotFound(); // Return 404 Not Found if the comment doesn't exist
                }

                return Ok(comment); // Return the comment
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching the comment."); // Return an error response
            }
        }

        [HttpGet]
        [Route("GetAllComments")]
        public async Task<IActionResult> GetAllComments()
        {
            try
            {
                var comments = await dbContext.Comments.ToListAsync();

                return Ok(comments); // Return all comments
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching comments."); // Return an error response
            }
        }

        // naya fxns
        [HttpPost("{commentId}/downvote")]
        public async Task<ActionResult> Downvote(int commentId)
        {
            // Call the method to add the comment to the blog
            // Retrieve the blog from the database
            var blog = await dbContext.Comments.FindAsync(commentId);
            string getCurrentUserId = _userAuthenticationRepository.GetUserId();
            var existingReaction = dbContext.CommentReactions.FirstOrDefault(r => r.UserId == getCurrentUserId && r.CommentID == commentId);
            // Create a new Reaction
            var newReaction = new CommentReaction
            {
                UserId = getCurrentUserId,
                CommentID = commentId
            };
            if (existingReaction == null)
            {


                // Upvote the blog
                newReaction.Downvote = true;
                newReaction.CreatedAt = DateTime.Now;

                // Add the new Reaction to DbContext and save changes
                dbContext.CommentReactions.Add(newReaction);
            }
            else
            {
                if (existingReaction.Downvote)
                {
                    // If user previously upvoted, toggle off the upvote
                    existingReaction.Downvote = false;
                }
                else
                {
                    // If user previously downvoted or had no reaction, toggle on the upvote
                    existingReaction.Downvote = true;
                    existingReaction.CreatedAt = DateTime.Now;
                    existingReaction.Upvote = false; // Reset downvote if applicable
                }
            }


            // Save changes to persist the new comment in the database
            await dbContext.SaveChangesAsync();

            return Ok(); // Return 200 OK if the comment was added successfully
        }

        [HttpPost("{commentId}/upvote")]
        public async Task<ActionResult> Upvote(int commentId)
        {
            // Call the method to add the comment to the blog
            // Retrieve the blog from the database
            var blog = await dbContext.Comments.FindAsync(commentId);
            string getCurrentUserId = _userAuthenticationRepository.GetUserId();
            var existingReaction = dbContext.CommentReactions.FirstOrDefault(r => r.UserId == getCurrentUserId && r.CommentID == commentId);
            // Create a new Reaction
            var newReaction = new CommentReaction
            {
                UserId = getCurrentUserId,
                CommentID = commentId
            };
            if (existingReaction == null)
            {


                // Upvote the blog
                newReaction.Upvote = true;
                newReaction.CreatedAt = DateTime.Now;
                // Add the new Reaction to DbContext and save changes
                dbContext.CommentReactions.Add(newReaction);
            }
            else
            {
                if (existingReaction.Upvote)
                {
                    // If user previously upvoted, toggle off the upvote
                    existingReaction.Upvote = false;
                }
                else
                {
                    // If user previously downvoted or had no reaction, toggle on the upvote
                    existingReaction.Upvote = true;
                    existingReaction.CreatedAt = DateTime.Now;
                    existingReaction.Downvote = false; // Reset downvote if applicable
                }
            }



            // Save changes to persist the new comment in the database
            await dbContext.SaveChangesAsync();

            return Ok(); // Return 200 OK if the comment was added successfully
        }

        private bool CommentExists(int id)
        {
            return dbContext.Comments.Any(e => e.CommentId == id);
        }

    }
}
