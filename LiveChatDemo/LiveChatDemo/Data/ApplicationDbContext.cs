using LiveChatDemo.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LiveChatDemo.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure primary key indexes on Id columns
            builder.Entity<ApplicationUser>().HasIndex(u => u.Id).IsUnique();
            builder.Entity<Entity>().HasIndex(e => e.Id).IsUnique();
            builder.Entity<Message>().HasIndex(m => m.Id).IsUnique();
            builder.Entity<Chat>().HasIndex(c => c.Id).IsUnique();
            builder.Entity<UserRelation>().HasIndex(r => r.Id).IsUnique();
        }

        // DbSets
        public DbSet<Entity> Entities { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<UserRelation> UserRelations { get; set; }
    }
}
