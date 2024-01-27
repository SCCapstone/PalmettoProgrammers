namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class PostServiceTests
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public PostServiceTests()
    {
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("GameServiceTest")
            .Options;

        using var context = new AppDbContext(_contextOptions);

        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        context.SaveChanges();
    }

    AppDbContext CreateContext() => new(_contextOptions);
    async Task<ApplicationUser> CreateUser(AppDbContext context)
    {
        var configPairs = new Dictionary<string, string?> { { "JWT_SECRET", "1234567890" } };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configPairs)
            .Build();

        var accountService = new AccountsService(configuration, context);

        Credentials credentials = new() { Username = "Test", Password = "Test" };

        ApplicationUser user = await accountService.Register(credentials);

        return user;
    }

    [Fact]
    public async void CreatePost_WithValidParams_ReturnsCreated()
    {
        // Arrange
        using var context = CreateContext();
        var gameService = new GameService(context);
        var chatService = new ChatService(context);
        var postService = new PostService(context, chatService);
        ApplicationUser user = await CreateUser(context);

        // Act
        Game game = await gameService.CreateGame("Game Title");
        Post post = new()
        {
            Title = "Title Text",
            Description = "Description Text",
            GameId = game.Id,
            CreatorId = user.UserId,
        };
        var createdPost = await postService.CreatePost(post);

        // Assert
        Assert.Equal(post.Title, createdPost.Title);
        Assert.Equal(post.Description, createdPost.Description);
    }

    [Fact]
    public async void UpdatePost_WithValidParams_ReturnsUpdated()
    {
        // Arrange
        using var context = CreateContext();
        var gameService = new GameService(context);
        var chatService = new ChatService(context);
        var postService = new PostService(context, chatService);
        ApplicationUser user = await CreateUser(context);

        Game game = await gameService.CreateGame("Game Title");
        Post post = new()
        {
            Title = "Title Text",
            Description = "Description Text",
            GameId = game.Id,
            CreatorId = user.UserId,
        };
        var createdPost = await postService.CreatePost(post);

        // Act
        createdPost.Description = "Description Text 2";
        var updatedPost = await postService.UpdatePost(createdPost);

        // Assert
        Assert.Equal(createdPost.Description, updatedPost.Description);
    }
}
