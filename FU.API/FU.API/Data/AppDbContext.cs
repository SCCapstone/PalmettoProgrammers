﻿namespace FU.API.Data;

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
    /// <param name="modelBuilder">The builder.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Give 1 foreign key to Chat for LastMessage
        modelBuilder.Entity<Chat>()
            .HasOne(c => c.LastMessage)
            .WithOne()
            .HasForeignKey<Chat>(c => c.LastMessageId);

        // Make sure the username is unique
        modelBuilder.Entity<ApplicationUser>()
            .HasIndex(u => u.Username)
            .IsUnique();

        // Make sure the email is unique
        modelBuilder.Entity<ApplicationUser>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Make sure the name of the tag is unique
        modelBuilder.Entity<Tag>()
            .HasIndex(t => t.Name)
            .IsUnique();

        // Make sure the name of the group is unique
        modelBuilder.Entity<Group>()
            .HasIndex(g => g.Name)
            .IsUnique();

        // Make sure the name of the game is unique
        modelBuilder.Entity<Game>()
            .HasIndex(g => g.Name)
            .IsUnique();

        // On deleting user, set post creator to null in Post
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Creator)
            .WithMany()
            .OnDelete(DeleteBehavior.SetNull);

        // On deleting user, set creator to null in Chat
        modelBuilder.Entity<Chat>()
            .HasOne(c => c.Creator)
            .WithMany()
            .OnDelete(DeleteBehavior.SetNull);

        // On deleting user, set sender to null in Message
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .OnDelete(DeleteBehavior.SetNull);

        // On deleting user, delete all chat memberships
        modelBuilder.Entity<ChatMembership>()
            .HasOne(cm => cm.User)
            .WithMany()
            .OnDelete(DeleteBehavior.Cascade);

        // Delete user relations when user is deleted
        modelBuilder.Entity<UserRelation>()
            .HasOne(ur => ur.User1)
            .WithMany()
            .OnDelete(DeleteBehavior.Cascade);

        // Delete user relations when user is deleted
        modelBuilder.Entity<UserRelation>()
            .HasOne(ur => ur.User2)
            .WithMany()
            .OnDelete(DeleteBehavior.Cascade);

        // On deleting user, delete all group memberships
        modelBuilder.Entity<GroupMembership>()
            .HasOne(gm => gm.User)
            .WithMany()
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }

    /// <summary>
    /// Gets or sets the users.
    /// </summary>
    public DbSet<ApplicationUser> Users { get; set; } = null!;

    /// <summary>
    /// Gets or sets UserRelations.
    /// </summary>
    public DbSet<UserRelation> UserRelations { get; set; } = null!;

    /// <summary>
    /// Gets or sets chats.
    /// </summary>
    public DbSet<Chat> Chats { get; set; } = null!;

    /// <summary>
    /// Gets or sets ChatMemberships.
    /// </summary>
    public DbSet<ChatMembership> ChatMemberships { get; set; } = null!;

    /// <summary>
    /// Gets or sets Messages.
    /// </summary>
    public DbSet<Message> Messages { get; set; } = null!;

    /// <summary>
    /// Gets or sets Games.
    /// </summary>
    public DbSet<Game> Games { get; set; } = null!;

    /// <summary>
    /// Gets or sets GameRelations.
    /// </summary>
    public DbSet<GameRelation> GameRelations { get; set; } = null!;

    /// <summary>
    /// Gets or sets Groups.
    /// </summary>
    public DbSet<Group> Groups { get; set; } = null!;

    /// <summary>
    /// Gets or sets GroupMemberships.
    /// </summary>
    public DbSet<GroupMembership> GroupMemberships { get; set; } = null!;

    /// <summary>
    /// Gets or sets Posts.
    /// </summary>
    public DbSet<Post> Posts { get; set; } = null!;

    /// <summary>
    /// Gets or sets Tags.
    /// </summary>
    public DbSet<Tag> Tags { get; set; } = null!;

    /// <summary>
    /// Gets or sets TagRelations.
    /// </summary>
    public DbSet<TagRelation> TagRelations { get; set; } = null!;
}
