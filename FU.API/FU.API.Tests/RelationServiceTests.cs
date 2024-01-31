namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Models;
using FU.API.Services;
using FU.API.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class RelationServiceTests
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public RelationServiceTests()
    {
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("RelationServiceTestsDb")
            .Options;

        using var context = new AppDbContext(_contextOptions);

        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        context.SaveChanges();
    }

    AppDbContext CreateContext() => new(_contextOptions);

    [Fact]
    public async void HandleRelationAction_WithValidUsersAndAction_Friend()
    {
        // Arrange
        var context = CreateContext();

        var testUsers = MockDataHelper.CreateTestUsers();
        context.Set<ApplicationUser>().AddRange(testUsers);

        var relationService = new RelationService(context);

        // Act
        var initiatingUserId = testUsers[0].UserId;
        var otherUserId = testUsers[1].UserId;
        await relationService.HandleRelationAction(initiatingUserId, otherUserId, UserRelationAction.Friend);
        await relationService.HandleRelationAction(otherUserId, initiatingUserId, UserRelationAction.Friend);

        // Assert
        var relation = await context.UserRelations.FirstOrDefaultAsync(r => r.User1Id == initiatingUserId && r.User2Id == otherUserId);
        var inverseRelation = await context.UserRelations.FirstOrDefaultAsync(r => r.User1Id == otherUserId && r.User2Id == initiatingUserId);

        Assert.NotNull(relation);
        Assert.NotNull(inverseRelation);
        Assert.Equal(UserRelationStatus.Friends, relation.Status);
        Assert.Equal(UserRelationStatus.Friends, inverseRelation.Status);
    }

    [Fact]
    public async void HandleRelationAction_WithValidUsersAndAction_DeclineFriend()
    {
        // Arrange
        var context = CreateContext();

        var testUsers = MockDataHelper.CreateTestUsers();
        context.Set<ApplicationUser>().AddRange(testUsers);

        var relationService = new RelationService(context);

        // Act
        var initiatingUserId = testUsers[0].UserId;
        var otherUserId = testUsers[1].UserId;
        await relationService.HandleRelationAction(initiatingUserId, otherUserId, UserRelationAction.Friend);
        await relationService.RemoveRelation(otherUserId, initiatingUserId);

        // Assert
        var relation = await context.UserRelations.FirstOrDefaultAsync(r => r.User1Id == initiatingUserId && r.User2Id == otherUserId);
        var inverseRelation = await context.UserRelations.FirstOrDefaultAsync(r => r.User1Id == otherUserId && r.User2Id == initiatingUserId);

        Assert.Null(relation);
        Assert.Null(inverseRelation);
    }

    [Fact]
    public async void HandleRelationAction_WithValidUsersAndAction_Block()
    {
        // Arrange
        var context = CreateContext();

        var testUsers = MockDataHelper.CreateTestUsers();
        context.Set<ApplicationUser>().AddRange(testUsers);

        var relationService = new RelationService(context);

        // Act
        var initiatingUserId = testUsers[0].UserId;
        var otherUserId = testUsers[1].UserId;
        await relationService.HandleRelationAction(initiatingUserId, otherUserId, UserRelationAction.Block);

        // Assert
        var relation = await context.UserRelations.FirstOrDefaultAsync(r => r.User1Id == initiatingUserId && r.User2Id == otherUserId);
        var inverseRelation = await context.UserRelations.FirstOrDefaultAsync(r => r.User1Id == otherUserId && r.User2Id == initiatingUserId);

        Assert.NotNull(relation);
        Assert.NotNull(inverseRelation);
        Assert.Equal(UserRelationStatus.Blocked, relation.Status);
        Assert.Equal(UserRelationStatus.BlockedBy, inverseRelation.Status);
    }

    [Fact]
    public async void HandleRelationAction_WithValidUsersAndAction_CantRemoveBlockedByRelations()
    {
        // Arrange
        var context = CreateContext();

        var testUsers = MockDataHelper.CreateTestUsers();

        // testUsers[0] blocked testUsers[1]
        var testRelations = MockDataHelper.CreateTestRelations(testUsers);
        context.Set<ApplicationUser>().AddRange(testUsers);
        context.Set<UserRelation>().AddRange(testRelations);
        await context.SaveChangesAsync();

        var relationService = new RelationService(context);

        // Act
        var initiatingUserId = testUsers[0].UserId;
        var otherUserId = testUsers[1].UserId;

        // Assert
        await Assert.ThrowsAsync<ForbidException>(async () => await relationService.RemoveRelation(otherUserId, initiatingUserId));
    }

    [Theory]
    [InlineData(2, 1, UserRelationStatus.Blocked, false)]
    [InlineData(1, 1, UserRelationStatus.Blocked, true)]
    [InlineData(1, 1, UserRelationStatus.BlockedBy, false)]
    [InlineData(1, 5, UserRelationStatus.Friends, true)]
    [InlineData(2, 6, UserRelationStatus.Friends, true)]
    [InlineData(6, 6, UserRelationStatus.Friends, true)]
    [InlineData(3, 3, UserRelationStatus.Requested, true)]
    [InlineData(3, 4, UserRelationStatus.Pending, false)]
    public async void GetRelations_WithValidUserIdAndStatus_GetsRightResults(int requestingUserId, int checkUserId, UserRelationStatus status, bool getsResults)
    {
        // Arrange
        var context = CreateContext();

        var testUsers = MockDataHelper.CreateTestUsers();
        var testRelations = MockDataHelper.CreateTestRelations(testUsers);
        context.Set<ApplicationUser>().AddRange(testUsers);
        context.Set<UserRelation>().AddRange(testRelations);
        await context.SaveChangesAsync();

        var relationService = new RelationService(context);

        if (getsResults)
        {
            var relations = await relationService.GetRelations(checkUserId, status, requestingUserId == checkUserId);
            Assert.NotNull(relations);
            Assert.Single(relations);
        }
        else
        {
            await Assert.ThrowsAsync<ForbidException>(async () => await relationService.GetRelations(checkUserId, status, requestingUserId == checkUserId));
        }
    }


    // Test removing friend request
    // Test removing relation when blocked by
    // 
}
