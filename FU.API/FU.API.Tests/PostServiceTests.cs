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
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
    }

    private AppDbContext CreateContext()
    {
        var context = new AppDbContext(_contextOptions);

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

        return context;
    }

    // Test for GetPostUsers method

    [Theory]
    [InlineData(1, 1, true)]
    [InlineData(1, 2, true)]
    [InlineData(1, 5, false)]
    public async void GetPostUsers_WithValidPostId_CheckUserJoined(int postId, int checkUserId, bool expectedJoined)
    {
        // Arrange
        var context = CreateContext();
        var chatService = new ChatService(context);
        var postService = new PostService(context, chatService);

        // Act
        var postUsers = await postService.GetPostUsers(postId);

        // Assert
        var joined = postUsers.Any(u => u.UserId == checkUserId);
        Assert.Equal(expectedJoined, joined);
        Assert.Equal(4, postUsers.Count());
    }

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
