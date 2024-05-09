using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BIsleriumCW.Models
{
    public class Blog
    {

        [Key]
        public int BlogID { get; set; }
        [Required]
        public string BlogTitle { get; set; }
        public string BlogDescription { get; set; }

        public string BlogImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UpVote { get; set; }

        public int DownVote { get; set; }

        public double Popularity { get; set; }

        public bool IsDeleted { get; set; }

        [Required]
        public string UserId { get; set; }
        
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }
}
