using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BIsleriumCW.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }

        public string Comments { get; set; }

        //FK is user and blog

        public int BlogId { get; set; } //FK

        public Blog Blog { get; set; } //referencing to Blog

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }
}
