using BIsleriumCW.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BIsleriumCW.Data
{
    public class BisleriumDbContext : IdentityDbContext<ApplicationUser>
    {
        public BisleriumDbContext(DbContextOptions options) : base(options)
        { 
        
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options) =>
        options.UseSqlServer("Server=localhost;Database=BisleriumDB;Trusted_connection=True;Encrypt=False;");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }

        public DbSet<Blog> Blogs { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<BlogReaction> BlogReactions { get; set; }

        public DbSet<CommentReaction> CommentReactions { get; set; }
    }
}
