namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using Microsoft.EntityFrameworkCore;

public class SearchServiceSearchUsersTests : IDisposable
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;
    private readonly AppDbContext _dbContext;
    private readonly SearchService _searchService;
    private readonly UserService _userService;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public SearchServiceSearchUsersTests()
    {
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("SearchServiceSearchUsersTests")
            .Options;

        _dbContext = new AppDbContext(_contextOptions);

        _dbContext.Database.EnsureDeleted();
        _dbContext.Database.EnsureCreated();

        _dbContext.SaveChanges();

        _searchService = new SearchService(_dbContext);
        _userService = new UserService(_dbContext);
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }

    [Fact]
    public async Task Search_WithNoParams_ReturnsEverything()
    {
        // Arrange
        await TestsHelper.CreateUserAsync(_dbContext);

        // Act
        var userProfiles = await _searchService.SearchUsers(new UserQuery());

        // Assert
        Assert.Single(userProfiles);
    }
}
