using FU.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FU.API.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Give 1 foreign key to Chat for LastMessage
            builder.Entity<Chat>()
                .HasOne(c => c.LastMessage)
                .WithOne()
                .HasForeignKey<Chat>(c => c.LastMessageId);


            base.OnModelCreating(builder);
        }

        // DbSets
        public DbSet<UserRelation> UserRelations { get; set; }
        public DbSet<UserCredentials> UserCredentials { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<ChatMembership> ChatMemberships { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<GameRelation> GameRelations { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMembership> GroupMemberships { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<TagRelation> TagRelations { get; set; }
    }
}
