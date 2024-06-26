namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using Microsoft.EntityFrameworkCore;

public class SearchServiceSearchPostsTests : IDisposable
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;
    private readonly AppDbContext _dbContext;
    private readonly SearchService _searchService;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public SearchServiceSearchPostsTests()
    {
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("SearchServiceSearchPostsTestsDb")
            .Options;

        _dbContext = new AppDbContext(_contextOptions);

        _dbContext.Database.EnsureDeleted();
        _dbContext.Database.EnsureCreated();

        _dbContext.SaveChanges();

        _searchService = new SearchService(_dbContext);
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }

    [Fact]
    public async Task Search_WithNoParams_ReturnsEverything()
    {
        // Arrange
        Game game = await TestsHelper.CreateTestGameAsync(_dbContext);
        var user = await TestsHelper.CreateUserAsync(_dbContext);
        var post = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
        };

        await _dbContext.Posts.AddAsync(post);
        await _dbContext.SaveChangesAsync();

        // Act
        (List<Post> posts, var totalResults) = await _searchService.SearchPosts(new PostQuery());

        // Assert
        Assert.Single(posts);
    }

    [Fact]
    public async Task Search_WithSearchTimeAfterPostEndTime_FiltersOne()
    {
        // Arrange
        TimeOnly searchTime = new(15, 0);
        Game game = await TestsHelper.CreateTestGameAsync(_dbContext);
        var user = await TestsHelper.CreateUserAsync(_dbContext);
        // Create a post that ends an hour before the search time
        var post1 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = new DateOnly(2099, 1, 1).ToDateTime(searchTime.AddHours(-2)),
            EndTime = new DateOnly(2099, 1, 1).ToDateTime(searchTime.AddHours(-1)),
        };
        // Create a post that starts an after the search time
        var post2 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = new DateOnly(2099, 1, 1).ToDateTime(searchTime.AddHours(1)),
            EndTime = new DateOnly(2099, 1, 1).ToDateTime(searchTime.AddHours(2)),
        };

        await _dbContext.Posts.AddRangeAsync(post1, post2);
        await _dbContext.SaveChangesAsync();

        // Act
        (List<Post> posts, var totalResults) = await _searchService.SearchPosts(new PostQuery()
        {
            StartOnOrAfterTime = searchTime,
        });

        // Assert
        Assert.Single(posts);
    }

    [Fact]
    public async Task Search_WithSearchTimeBeforePostStartTime_FiltersOne()
    {
        // Arrange
        TimeOnly searchTime = new(15, 0);
        Game game = await TestsHelper.CreateTestGameAsync(_dbContext);
        var user = await TestsHelper.CreateUserAsync(_dbContext);
        // Create a post that ends an hour before the search time
        var post1 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = new DateOnly(2099, 1, 1).ToDateTime(searchTime.AddHours(-2)),
            EndTime = new DateOnly(2099, 1, 1).ToDateTime(searchTime.AddHours(-1)),
        };
        // Create a post that starts an after the search time
        var post2 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = new DateOnly(2099, 1, 1).ToDateTime(searchTime.AddHours(1)),
            EndTime = new DateOnly(2099, 1, 1).ToDateTime(searchTime.AddHours(2)),
        };

        await _dbContext.Posts.AddRangeAsync(post1, post2);
        await _dbContext.SaveChangesAsync();

        // Act
        (List<Post> posts, var totalResults) = await _searchService.SearchPosts(new PostQuery()
        {
            EndOnOrBeforeTime = searchTime,
        });

        // Assert
        Assert.Single(posts);
    }

    [Fact]
    public async Task Search_WithSearchStartDate_FiltersOne()
    {
        // Arrange
        DateOnly searchDate = new(2020, 1, 1);
        Game game = await TestsHelper.CreateTestGameAsync(_dbContext);
        var user = await TestsHelper.CreateUserAsync(_dbContext);
        // Create a post is the day before the search date
        var post1 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = searchDate.AddDays(-1).ToDateTime(TimeOnly.MinValue),
            EndTime = searchDate.AddDays(-1).ToDateTime(TimeOnly.MaxValue),
        };
        // Create a post is the day after the search date
        var post2 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = searchDate.AddDays(1).ToDateTime(TimeOnly.MinValue),
            EndTime = searchDate.AddDays(1).ToDateTime(TimeOnly.MaxValue),
        };

        await _dbContext.Posts.AddRangeAsync(post1, post2);
        await _dbContext.SaveChangesAsync();

        // Act
        (List<Post> posts, var totalResults) = await _searchService.SearchPosts(new PostQuery()
        {
            StartOnOrAfterDateTime = searchDate.ToDateTime(new TimeOnly(1, 1, 1)),
        });

        // Assert
        Assert.Single(posts);
    }

    [Fact]
    public async Task Search_WithSearchEndDateDate_FiltersOne()
    {
        // Arrange
        DateOnly searchDate = new(2020, 1, 1);
        Game game = await TestsHelper.CreateTestGameAsync(_dbContext);
        var user = await TestsHelper.CreateUserAsync(_dbContext);
        // Create a post is the day before the search date
        var post1 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = searchDate.AddDays(-1).ToDateTime(TimeOnly.MinValue),
            EndTime = searchDate.AddDays(-1).ToDateTime(TimeOnly.MaxValue),
        };
        // Create a post is the day after the search date
        var post2 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = searchDate.AddDays(1).ToDateTime(TimeOnly.MinValue),
            EndTime = searchDate.AddDays(1).ToDateTime(TimeOnly.MaxValue),
        };

        await _dbContext.Posts.AddRangeAsync(post1, post2);
        await _dbContext.SaveChangesAsync();

        // Act
        (List<Post> posts, var totalResults) = await _searchService.SearchPosts(new PostQuery()
        {
            EndOnOrBeforeDateTime = searchDate.ToDateTime(new TimeOnly(1, 1, 1)),
        });

        // Assert
        Assert.Single(posts);
    }

    [Fact]
    public async Task Search_WithSearchDateAsToday_SearchesAfterNow()
    {
        // Arrange
        Game game = await TestsHelper.CreateTestGameAsync(_dbContext);
        var user = await TestsHelper.CreateUserAsync(_dbContext);
        // Create a post that ends an hour before the search time
        var post1 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = DateTime.UtcNow.AddHours(-2),
            EndTime = DateTime.UtcNow.AddHours(-1),
        };
        // Create a post that starts an after the search time
        var post2 = new Post()
        {
            GameId = game.Id,
            CreatorId = user.UserId,
            StartTime = DateTime.UtcNow.AddHours(1),
            EndTime = DateTime.UtcNow.AddHours(2),
        };

        await _dbContext.Posts.AddRangeAsync(post1, post2);
        await _dbContext.SaveChangesAsync();

        // Act
        (List<Post> posts, var totalResults) = await _searchService.SearchPosts(new PostQuery()
        {
            StartOnOrAfterDateTime = DateTime.UtcNow,
        });

        // Assert
        Assert.Single(posts);
    }
}
