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
        var configPairs = new Dictionary<string, string?> { { "JWT_SECRET", "1234567890" } };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configPairs)
            .Build();

        var accountService = new AccountsService(configuration, context);

        Credentials credentials = new() { Username = "Test", Password = "Test" };

        ApplicationUser user = await accountService.Register(credentials);

        return user;
    }
}
