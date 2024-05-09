using System.ComponentModel.DataAnnotations;

namespace BIsleriumCW.Models
{
    public class CommentReaction
    {
        [Key]
        public int CommentReactId { get; set; }

        public bool Upvote { get; set; } = false;
        public bool Downvote { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public int CommentID { get; set; } //FK

        public Comment Comment { get; set; } //referencing to Blog
    }
}
