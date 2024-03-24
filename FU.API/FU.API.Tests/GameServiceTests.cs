namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using Microsoft.EntityFrameworkCore;

public class GameServiceTests : IDisposable
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;
    private readonly AppDbContext _dbContext;
    private readonly GameService _gameService;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public GameServiceTests()
    {
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("GameServiceTest")
            .Options;

        using var context = new AppDbContext(_contextOptions);

        // Setup Db
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        context.SaveChanges();

        // Setup and create a game service
        _dbContext = new(_contextOptions);
        _gameService = new(_dbContext);
    }

    [Theory]
    [InlineData("")]
    [InlineData("Title1")]
    [InlineData("Title with space")]
    [InlineData("Title with symbols :-={}<>.")]
    public async void CreateGame_WithValidString_ReturnsGame(string gameName)
    {
        // Act
        var game = await _gameService.CreateGame(gameName);

        // Assert
        Assert.Equal(game.Name, gameName);
    }

    [Fact]
    public async void DeleteGame_WithValidGame_DeletesGame()
    {
        // Arrange
        Game game = await _gameService.CreateGame("game1");

        // Act
        await _gameService.DeleteGame(game);


        // Assert
        Assert.Null(await _gameService.GetGame(game.Id));
    }

    [Fact]
    public async void GetGame_WithValidGame_GetsGame()
    {
        // Arrange
        Game createdGame = await _gameService.CreateGame("game1");

        // Act
        Game? fetchedGame = await _gameService.GetGame(createdGame.Id);

        // Assert
        Assert.NotNull(fetchedGame);
    }

    [Theory]
    [InlineData("gameC", 0)]
    [InlineData("gameB", 2)]
    [InlineData("", 3)]
    public async void GetGames_WithGames_ReturnCorrectNumResults(string queryString, int numResults)
    {
        // Arrange
        await _gameService.CreateGame("gameA1");
        await _gameService.CreateGame("gameB2");
        await _gameService.CreateGame("gameB3");

        // Act
        var fetchedGames = await _gameService.GetGames(queryString);

        // Assert
        Assert.Equal(numResults, fetchedGames.Count());
    }

    [Fact]
    public async void UpdateGame_WithValidGame_UpdatesGameTitle()
    {
        // Arrange
        var game = await _gameService.CreateGame("gameA1");
        game.Name = "gameB2";

        // Act
        await _gameService.UpdateGame(game);

        // Assert
        var fetchedGame = await _gameService.GetGame(game.Id);
        Assert.Equal(game.Name, fetchedGame?.Name);
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }
}
