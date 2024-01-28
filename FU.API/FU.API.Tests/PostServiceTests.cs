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
    [InlineData(1, 5, false)]
    public async void GetPostUsers_WithValidPostId_CheckUserJoined(int postId, int checkUserId, bool expectedJoined)
    {
        // Arrange
        var context = CreateContext();
        var testUsers = CreateTestUsers();
        var testChat = CreateTestChat(testUsers);
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
        Assert.Equal(4, postUsers.Count());
    }

    AppDbContext CreateContext() => new(_contextOptions);

    private List<ApplicationUser> CreateTestUsers()
    {
        return new List<ApplicationUser>()
        {
            new ApplicationUser()
            {
                UserId = 1,
                Username = "User1",
            },
            new ApplicationUser()
            {
                UserId = 2,
                Username = "User2",
            },
            new ApplicationUser()
            {
                UserId = 3,
                Username = "User3",
            },
            new ApplicationUser()
            {
                UserId = 4,
                Username = "User4",
            },
        };
    }

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

    private Chat CreateTestChat(List<ApplicationUser> users)
    {
        return new Chat()
        {
            Id = 1,
            ChatType = ChatType.Post,
            ChatName = "Title1",
            CreatorId = 1,
            Members = users.Select(u => new ChatMembership()
            {
                ChatId = 1,
                UserId = u.UserId,
                User = u,
            }).ToList(),
        };
    }
}
