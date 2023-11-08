namespace FU.API.Data
{
    using FU.API.Models;
    using Microsoft.EntityFrameworkCore;

    /// <summary>
    /// Our AppDbContext.
    /// </summary>
    public class AppDbContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AppDbContext"/> class.
        /// </summary>
        /// <param name="options">Options for the AppDbContext.</param>
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Create new models.
        /// </summary>
        /// <param name="builder">The builder.</param>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Give 1 foreign key to Chat for LastMessage
            builder.Entity<Chat>()
                .HasOne(c => c.LastMessage)
                .WithOne()
                .HasForeignKey<Chat>(c => c.LastMessageId);

            // Make sure the username is unique
            builder.Entity<ApplicationUser>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Make sure the email is unique
            builder.Entity<ApplicationUser>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Make sure the name of the tag is unique
            builder.Entity<Tag>()
                .HasIndex(t => t.Name)
                .IsUnique();

            // Make sure the name of the group is unique
            builder.Entity<Group>()
                .HasIndex(g => g.Name)
                .IsUnique();

            // Make sure the name of the game is unique
            builder.Entity<Game>()
                .HasIndex(g => g.Name)
                .IsUnique();

            base.OnModelCreating(builder);
        }

        /// <summary>
        /// Gets or sets the users.
        /// </summary>
        public DbSet<ApplicationUser> Users { get; set; }

        /// <summary>
        /// Gets or sets UserRelations.
        /// </summary>
        public DbSet<UserRelation> UserRelations { get; set; }

        /// <summary>
        /// Gets or sets chats.
        /// </summary>
        public DbSet<Chat> Chats { get; set; }

        /// <summary>
        /// Gets or sets ChatMemberships.
        /// </summary>
        public DbSet<ChatMembership> ChatMemberships { get; set; }

        /// <summary>
        /// Gets or sets Messages.
        /// </summary>
        public DbSet<Message> Messages { get; set; }

        /// <summary>
        /// Gets or sets Games.
        /// </summary>
        public DbSet<Game> Games { get; set; }

        /// <summary>
        /// Gets or sets GameRelations.
        /// </summary>
        public DbSet<GameRelation> GameRelations { get; set; }

        /// <summary>
        /// Gets or sets Groups.
        /// </summary>
        public DbSet<Group> Groups { get; set; }

        /// <summary>
        /// Gets or sets GroupMemberships.
        /// </summary>
        public DbSet<GroupMembership> GroupMemberships { get; set; }

        /// <summary>
        /// Gets or sets Posts.
        /// </summary>
        public DbSet<Post> Posts { get; set; }

        /// <summary>
        /// Gets or sets Tags.
        /// </summary>
        public DbSet<Tag> Tags { get; set; }

        /// <summary>
        /// Gets or sets TagRelations.
        /// </summary>
        public DbSet<TagRelation> TagRelations { get; set; }
    }
}
