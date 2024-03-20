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
        _userService = new UserService(_dbContext, _searchService);
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
        (var userProfiles, var totalResults) = await _searchService.SearchUsers(new UserQuery());

        // Assert
        Assert.Single(userProfiles);
    }

    [Fact]
    public async Task Search_WithKeyword_SearchesTitleAndBio()
    {
        // Arrange
        var user1 = await TestsHelper.CreateUserAsync(_dbContext, new Credentials()
        {
            Username = "User1",
            Email = "fake1@email.com",
            Password = "Pass1"
        });
        var user2 = await TestsHelper.CreateUserAsync(_dbContext, new Credentials()
        {
            Username = "User2",
            Email = "fake2@email.com",
            Password = "Pass2"
        });
        var user3 = await TestsHelper.CreateUserAsync(_dbContext, new Credentials()
        {
            Username = "User3",
            Email = "fake3@email.com",
            Password = "Pass3"
        });
        await _userService.UpdateUserProfile(new UserProfile() { Bio = "Bio3", Id = user3.UserId });

        // Act
        (var userProfiles, var totalResults) = await _searchService.SearchUsers(new UserQuery() { Keywords = new() { "user2", "bio3" } });

        // Assert
        Assert.Equal(2, userProfiles.Count);
    }
}
