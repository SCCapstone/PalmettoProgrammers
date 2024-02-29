namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using FU.API.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

public class PostServiceTests
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public PostServiceTests()
    {
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("PostServiceTestDb")
            .Options;

        using var context = new AppDbContext(_contextOptions);

        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        context.SaveChanges();
    }

    [Theory]
    [InlineData(1, 1, true)]
    [InlineData(1, 2, true)]
    [InlineData(1, 9, false)]
    public async void GetPostUsers_WithValidPostId_CheckUserJoined(int postId, int checkUserId, bool expectedJoined)
    {
        // Arrange
        var context = CreateContext();

        var testUsers = MockDataHelper.CreateTestUsers();
        var testChat = MockDataHelper.CreateTestChat(testUsers);
        context.Set<Chat>().Add(testChat);
        context.Set<ApplicationUser>().AddRange(testUsers);

        var post = new Post()
        {
            Id = 1,
            Title = "TestTitle",
            GameId = 1,
            CreatorId = testUsers[0].UserId,
            Creator = testUsers[0],
            ChatId = testChat.Id,
            Chat = testChat,
        };

        context.Set<Post>().Add(post);
        context.SaveChanges();


        var chatService = new ChatService(context);
        var postService = new PostService(context, chatService);

        // Act
        var postUsers = await postService.GetPostUsers(postId);

        // Assert
        var joined = postUsers.Any(u => u.UserId == checkUserId);
        Assert.Equal(expectedJoined, joined);
        Assert.Equal(6, postUsers.Count());
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
        ApplicationUser user = await TestsHelper.CreateUserAsync(context);

        // Act
        Game game = await gameService.CreateGame("Game Title");
        Post post = new()
        {
            Title = "Title Text",
            Description = "Description Text",
            GameId = game.Id,
            Creator = user,
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
        ApplicationUser user = await TestsHelper.CreateUserAsync(context);

        Game game = await gameService.CreateGame("Game Title");
        Post post = new()
        {
            Title = "Title Text",
            Description = "Description Text",
            GameId = game.Id,
            Creator = user,
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
