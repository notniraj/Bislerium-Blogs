using System.ComponentModel.DataAnnotations;

namespace BIsleriumCW.Models
{
    public class CommentReaction
    {
        [Key]
        public int CommentReactId { get; set; }

        public bool HasLiked { get; set; }

        //Fk is user and comment

        public int CommentID { get; set; } //FK

        public Comment Comment { get; set; } //referencing to Blog
    }
}
