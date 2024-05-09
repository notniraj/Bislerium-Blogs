using BIsleriumCW.Models;


namespace BIsleriumCW.Services
{
    public static class BlogPopularityCalculator
    {
        public static int CalculateBlogPopularity(int blogId, IQueryable<BlogReaction> reactions, IQueryable<Comment> comments)
        {
            // Define weightage constants for upvotes, downvotes, and comments
            int upvoteWeightage = 2;
            int downvoteWeightage = -1;
            int commentWeightage = 1;

            // Calculate the number of upvotes, downvotes, and comments for the specified blogId
            int upvotes = reactions.Count(r => r.BlogId == blogId && r.Upvote);
            int downvotes = reactions.Count(r => r.BlogId == blogId && r.Downvote);
            int numComments = comments.Count(c => c.BlogId == blogId);

            // Calculate BlogPopularity using the specified formula
            int blogPopularity = (upvoteWeightage * upvotes) + (downvoteWeightage * downvotes) + (commentWeightage * numComments);

            return blogPopularity;
        }
    }
}