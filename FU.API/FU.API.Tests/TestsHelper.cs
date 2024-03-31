namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using Microsoft.Extensions.Configuration;

public static class TestsHelper
{
    public static async Task<Game> CreateTestGameAsync(AppDbContext dbContext)
    {
        var gameService = new GameService(dbContext);
        Game createdGame = await gameService.CreateGame("TestGame");

        return createdGame;
    }

    public static async Task<ApplicationUser> CreateUserAsync(AppDbContext context)
    {
        Credentials credentials = new() { Username = "Test", Password = "Test", Email = "fake@email.com" };
        return await CreateUserAsync(context, credentials);
    }

    public static async Task<ApplicationUser> CreateUserAsync(AppDbContext context, Credentials credentials)
    {
        var configPairs = new Dictionary<string, string?>
        {
            { "JWT_SECRET", "1234567890" },
            { "EMAIL_CONNECTION_STRING", "endpoint=https://fake.com/;accesskey=Pdada/dsadasd==" },
            { "BASE_SPA_URL", "http://localhost:5173/" },
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configPairs)
            .Build();

        var accountService = new AccountsService(configuration, context, new EmailService(configuration));

        ApplicationUser user = await accountService.Register(credentials);

        return user;
    }

    public static async Task<Post> CreateTestPostAsync(AppDbContext context)
    {
        var chatService = new ChatService(context);
        var postService = new PostService(context, chatService);

        var gameService = new GameService(context);
        Game game = await gameService.CreateGame("Game Title");

        ApplicationUser user = await TestsHelper.CreateUserAsync(context);
        Post post = new()
        {
            Title = "Title Text",
            Description = "Description Text",
            GameId = game.Id,
            Creator = user,
            CreatorId = user.UserId,
        };

        return await postService.CreatePost(post);
    }
}
