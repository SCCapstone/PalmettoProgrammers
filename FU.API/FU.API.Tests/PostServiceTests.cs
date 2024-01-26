namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using Microsoft.EntityFrameworkCore;

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

    [Fact]
    public async void CreatePost_WithValidParams_ReturnsCreated()
    {
        // Arrange
        using var context = CreateContext();
        var gameService = new GameService(context);
        var chatService = new ChatService(context);
        var postService = new PostService(context, chatService);

        // Act
        Game game = await gameService.CreateGame("Game Title");
        Post post = new()
        {
            Title = "Title Text",
            Description = "Description Text",
            GameId = game.Id,
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

        Game game = await gameService.CreateGame("Game Title");
        Post post = new()
        {
            Title = "Title Text",
            Description = "Description Text",
            GameId = game.Id,
        };
        var createdPost = await postService.CreatePost(post);

        // Act
        createdPost.Description = "Description Text 2";
        var updatedPost = await postService.UpdatePost(createdPost);

        // Assert
        Assert.Equal(createdPost.Description, updatedPost.Description);
    }
}
