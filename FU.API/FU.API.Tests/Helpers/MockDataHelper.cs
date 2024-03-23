namespace FU.API.Tests.Helpers;

using FU.API.Models;
using System.Collections.Generic;
using System.Linq;

public static class MockDataHelper
{
    public static List<ApplicationUser> CreateTestUsers()
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
            new ApplicationUser()
            {
                UserId = 5,
                Username = "User5",
            },
            new ApplicationUser()
            {
                UserId = 6,
                Username = "User6",
            },
        };
    }

    public static Chat CreateTestChat(List<ApplicationUser> users)
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

    public static List<UserRelation> CreateTestRelations(List<ApplicationUser> users)
    {
        return new List<UserRelation>()
        {
            new UserRelation()
            {
                User1 = users[0],
                User2 = users[1],
                Status = UserRelationStatus.Blocked,
            },
            new UserRelation()
            {
                User1 = users[1],
                User2 = users[0],
                Status = UserRelationStatus.BlockedBy,
            },
            new UserRelation()
            {
                User1 = users[2],
                User2 = users[3],
                Status = UserRelationStatus.Requested,
            },
            new UserRelation()
            {
                User1 = users[3],
                User2 = users[2],
                Status = UserRelationStatus.Pending,
            },
            new UserRelation()
            {
                User1 = users[4],
                User2 = users[5],
                Status = UserRelationStatus.Friends,
            },
            new UserRelation()
            {
                User1 = users[5],
                User2 = users[4],
                Status = UserRelationStatus.Friends,
            },
        };
    }
}
