namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Models;
using FU.API.Services;
using FU.API.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

public class PostServiceTests : IDisposable
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;
    private readonly AppDbContext _dbContext;
    private readonly PostService _postService;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public PostServiceTests()
    {
        // Setup database
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("PostServiceTestDb")
            .Options;
        _dbContext = new AppDbContext(_contextOptions);
        _dbContext.Database.EnsureDeleted();
        _dbContext.Database.EnsureCreated();
        _dbContext.SaveChanges();

        // Setup PostServce
        _dbContext = new(_contextOptions);
        var chatService = new ChatService(_dbContext);
        _postService = new PostService(_dbContext, chatService);
    }

    [Theory]
    [InlineData(1, 1, true)]
    [InlineData(1, 2, true)]
    [InlineData(1, 9, false)]
    public async void GetPostUsers_WithValidPostId_CheckUserJoined(int postId, int checkUserId, bool expectedJoined)
    {
        // Arrange
        var testUsers = MockDataHelper.CreateTestUsers();
        var testChat = MockDataHelper.CreateTestChat(testUsers);
        _dbContext.Set<Chat>().Add(testChat);
        _dbContext.Set<ApplicationUser>().AddRange(testUsers);

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

        _dbContext.Set<Post>().Add(post);
        _dbContext.SaveChanges();

        // Act
        var postUsers = await _postService.GetPostUsers(postId);

        // Assert
        var joined = postUsers.Any(u => u.UserId == checkUserId);
        Assert.Equal(expectedJoined, joined);
        Assert.Equal(6, postUsers.Count());
    }

    [Fact]
    public async void CreatePost_WithValidParams_ReturnsCreated()
    {
        // Arrange
        var gameService = new GameService(_dbContext);
        ApplicationUser user = await TestsHelper.CreateUserAsync(_dbContext);

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
        var createdPost = await _postService.CreatePost(post);

        // Assert
        Assert.Equal(post.Title, createdPost.Title);
        Assert.Equal(post.Description, createdPost.Description);
    }

    [Fact]
    public async void UpdatePost_WithValidParams_ReturnsUpdated()
    {
        // Arrange
        var createdPost = await TestsHelper.CreateTestPostAsync(_dbContext);

        // Act
        createdPost.Description = "Description Text 2";
        var updatedPost = await _postService.UpdatePost(createdPost);

        // Assert
        Assert.Equal(createdPost.Description, updatedPost.Description);
    }

    [Theory]
    [InlineData("2022-01-01T00:00:00", "2022-01-01T00:00:00")] // Date in the past
    [InlineData("2025-01-01T00:00:01", "2025-01-01T00:00:00")] // End time before start time
    [InlineData("9999-01-01T00:00:00", "9999-01-01T00:00:01")] // Date far in the future
    public async void CreatePost_InvalidDate(DateTime startTime, DateTime endTime)
    {
        // Arrange
        var gameService = new GameService(_dbContext);
        ApplicationUser user = await TestsHelper.CreateUserAsync(_dbContext);

        // Act
        Game game = await gameService.CreateGame("Game Title");
        Post post = new()
        {
            Title = "Title Text",
            Description = "Description Text",
            GameId = game.Id,
            Creator = user,
            CreatorId = user.UserId,
            StartTime = startTime,
            EndTime = endTime,
        };

        // Calling create post should throw a PostException
        await Assert.ThrowsAsync<PostException>(async () => await _postService.CreatePost(post));
    }
}
