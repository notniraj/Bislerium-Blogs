using System.ComponentModel.DataAnnotations;

namespace BIsleriumCW.Models
{
    public class BlogReaction
    {
        [Key]
        public int BlogReactId { get; set; }

        public bool Upvote { get; set; } = false;
        public bool Downvote { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }

        //FK is blog and user


        //For Blog
        public int BlogId { get; set; } //FK

        public Blog Blog { get; set; } //referencing to Blog Pakhe

    }
}
