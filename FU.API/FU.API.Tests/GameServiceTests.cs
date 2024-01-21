namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Services;
using Microsoft.EntityFrameworkCore;

public class GameServiceTests
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public GameServiceTests()
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

    [Theory]
    [InlineData("")]
    [InlineData("Title1")]
    [InlineData("Title with space")]
    [InlineData("Title with symbols :-={}<>.")]
    public async void CreateGame_WithValidString_ReturnsGame(string gameName)
    {
        // Arrange
        using var context = CreateContext();
        var gameService = new GameService(context);

        // Act
        var game = await gameService.CreateGame(gameName);

        // Assert
        Assert.Equal(game.Name, gameName);
    }
}
