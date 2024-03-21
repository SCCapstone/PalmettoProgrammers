namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using Microsoft.EntityFrameworkCore;

public class TagServiceTests : IDisposable
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;
    private readonly AppDbContext _dbContext;
    private readonly TagService _tagService;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public TagServiceTests()
    {
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("TagServiceTest")
            .Options;

        using var context = new AppDbContext(_contextOptions);

        // Setup Db
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        context.SaveChanges();

        // Setup and create a tag service
        _dbContext = new(_contextOptions);
        _tagService = new(_dbContext);
    }

    [Theory]
    [InlineData("")]
    [InlineData("title1")]
    [InlineData("title with space")]
    [InlineData("title with symbols :-={}<>.")]
    public async void CreateTag_WithValidString_ReturnsTag(string tagName)
    {
        // Act
        var tag = await _tagService.CreateTag(tagName);

        // Assert
        Assert.Equal(tagName, tag.Name);
    }

    [Fact]
    public async void DeleteTag_WithValidTag_DeletesTag()
    {
        // Arrange
        Tag tag = await _tagService.CreateTag("tag1");

        // Act
        await _tagService.DeleteTag(tag);


        // Assert
        Assert.Null(await _tagService.GetTag(tag.Id));
    }

    [Fact]
    public async void GetTag_WithValidTag_GetsTag()
    {
        // Arrange
        Tag createdTag = await _tagService.CreateTag("tag1");

        // Act
        Tag? fetchedTag = await _tagService.GetTag(createdTag.Id);

        // Assert
        Assert.NotNull(fetchedTag);
    }

    [Theory]
    [InlineData("tagC", 0)]
    [InlineData("tagB", 2)]
    [InlineData("", 3)]
    public async void GetTags_WithTags_ReturnCorrectNumResults(string queryString, int numResults)
    {
        // Arrange
        await _tagService.CreateTag("tagA1");
        await _tagService.CreateTag("tagB2");
        await _tagService.CreateTag("tagB3");

        // Act
        var fetchedTags = await _tagService.GetTags(queryString);

        // Assert
        Assert.Equal(numResults, fetchedTags.Count());
    }

    [Fact]
    public async void UpdateTag_WithValidTag_UpdatesTagTitle()
    {
        // Arrange
        var tag = await _tagService.CreateTag("tagA1");
        tag.Name = "tagB2";

        // Act
        await _tagService.UpdateTag(tag);

        // Assert
        var fetchedTag = await _tagService.GetTag(tag.Id);
        Assert.Equal(tag.Name, fetchedTag?.Name);
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }
}
