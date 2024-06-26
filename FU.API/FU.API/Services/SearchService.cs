namespace FU.API.Services;

using System.Linq.Expressions;
using FU.API.Data;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;
using LinqKit;
using FU.API.Helpers;

public class SearchService : CommonService, ISearchService
{
    private static readonly DateTime DefaultTime = DateTime.MinValue;

    private static readonly DateOnly DefaultDate = new DateOnly(1, 1, 1);

    private readonly AppDbContext _dbContext;

    public SearchService(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(List<UserProfile>, int TotalResults)> SearchUsers(UserQuery query)
    {
        if (query.UserId is not null && query.RelationStatus is not null)
        {
            return await SearchConnectedUsers(query);
        }
        else
        {
            return await SearchAllUsers(query);
        }
    }

    public async Task<(List<Post>, int TotalResults)> SearchPosts(PostQuery query)
    {
        var dbQuery = BuildDbQuery(query);

        // Count the total number of results so that the UI can display the correct number of pages
        int totalResults = await dbQuery.CountAsync();

        // Sort results
        IOrderedQueryable<Post> orderedDbQuery = query.SortDirection == SortDirection.Ascending
            ? dbQuery.OrderBy(
                SelectPostProperty(query.SortType))
            : dbQuery.OrderByDescending(
                SelectPostProperty(query.SortType));

        // Finally sort by Id to ensure order is consistent across calls.
        orderedDbQuery = orderedDbQuery.ThenBy(p => p.Id);

        var posts = await orderedDbQuery
                .Skip((query.Page - 1) * query.Limit)
                .Take(query.Limit)
                .Include(p => p.Creator)
                .Include(p => p.Tags).ThenInclude(pt => pt.Tag)
                .Include(p => p.Game)
                .ToListAsync();

        return (posts, totalResults);
    }

    // Determines if a keyword is a user's username or bio
    private static Expression<Func<ApplicationUser, bool>> UserContainsKeywords(List<string> keywords)
    {
        if (keywords.Count == 0)
        {
            return PredicateBuilder.New<ApplicationUser>(true); // nothing to do so return a true predicate
        }

        var predicate = PredicateBuilder.New<ApplicationUser>(false); // create a predicate that's false by default
        foreach (string keyword in keywords)
        {
            predicate = predicate.Or(u => u.NormalizedBio.Contains(keyword.ToUpper()) || u.NormalizedUsername.Contains(keyword.ToUpper()));
        }

        return predicate;
    }

    private static Expression<Func<UserRelation, bool>> ConnectedUserContainsKeywords(List<string> keywords)
    {
        if (keywords.Count == 0)
        {
            return PredicateBuilder.New<UserRelation>(true); // nothing to do so return a true predicate
        }

        var predicate = PredicateBuilder.New<UserRelation>(false); // create a predicate that's false by default
        foreach (string keyword in keywords)
        {
            predicate = predicate.Or(ur => ur.User2.NormalizedBio.Contains(keyword.ToUpper()) || ur.User2.NormalizedUsername.Contains(keyword.ToUpper()));
        }

        return predicate;
    }

    // Determines if a keyword is a posts's description or title
    private static Expression<Func<Post, bool>> PostContainsKeywords(List<string> keywords)
    {
        if (keywords.Count == 0)
        {
            return PredicateBuilder.New<Post>(true); // nothing to do so return a true predicate
        }

        var predicate = PredicateBuilder.New<Post>(false); // create a predicate that's false by default
        foreach (string keyword in keywords)
        {
            predicate = predicate.Or(p => p.NormalizedDescription.Contains(keyword.ToUpper()) || p.NormalizedTitle.Contains(keyword.ToUpper()));
        }

        return predicate;
    }

    private static Expression<Func<Post, object>> SelectPostProperty(PostSortType? sortType)
    {
        return sortType switch
        {
            PostSortType.NewestCreated => (post) => post.CreatedAt,
            PostSortType.Title => (post) => post.NormalizedTitle,
            PostSortType.EarliestToScheduledTime => (post) => post.StartTime ?? DefaultTime,
            PostSortType.ChatActivity => (post) => post.Chat.LastMessageAt ?? DefaultTime,
            _ => (post) => post.CreatedAt,
        };
    }

    private static Expression<Func<ApplicationUser, object>> SelectUserProperty(UserSortType? sortType)
    {
        return sortType switch
        {
            UserSortType.Username => (user) => user.NormalizedUsername,
            UserSortType.DOB => (user) => user.DOB ?? DefaultDate,
            _ => (user) => user.NormalizedUsername,
        };
    }

    private static Expression<Func<UserRelation, object>> SelectConnectedUserProperty(UserSortType? sortType)
    {
        return sortType switch
        {
            UserSortType.Username => (ur) => ur.User2.NormalizedUsername,
            UserSortType.ChatActivity => (ur) => ur.Chat.LastMessageAt ?? DefaultTime,
            UserSortType.DOB => (ur) => ur.User2.DOB ?? DefaultDate,
            _ => (ur) => ur.User2.NormalizedUsername,
        };
    }

    /// <summary>
    /// Gets the database query for users based on the given query.
    /// </summary>
    /// <param name="query">The query.</param>
    /// <returns>The users to query. Either related to user with UserId, or all users.</returns>
    private IQueryable<ApplicationUser> BuildUsersDbQuery(UserQuery query)
    {
        IQueryable<ApplicationUser> dbQuery = _dbContext.Users.Select(u => u);

        dbQuery = dbQuery.Where(UserContainsKeywords(query.Keywords));

        return dbQuery;
    }

    private IQueryable<UserRelation> BuildConnectedUsersDbQuery(UserQuery query)
    {
        IQueryable<UserRelation> dbQuery = _dbContext.UserRelations
            .Where(ur => ur.User1Id == query.UserId && ur.Status == query.RelationStatus)
            .Include(ur => ur.User2)
            .Include(ur => ur.Chat).ThenInclude(c => c.LastMessage).ThenInclude(m => m.Sender);

        dbQuery = dbQuery.Where(ConnectedUserContainsKeywords(query.Keywords));

        return dbQuery;
    }

    private IQueryable<Post> BuildDbQuery(PostQuery query)
    {
        IQueryable<Post> dbQuery;

        // Decide if member info should be included depending on if the request is anonymous
        if (query.UserId is not null)
        {
            dbQuery = _dbContext.Posts
                .Where(p => p.Chat.Members.Any(m => m.UserId == query.UserId))
                .Include(p => p.Chat).ThenInclude(c => c.LastMessage).ThenInclude(m => m.Sender)
                .Select(p => p);
        }
        else
        {
            dbQuery = _dbContext.Posts.Select(p => p);
        }

        // Filters are added one at a time
        // Generally filer out as much as as possible first

        // Filter by posts that start after the given date
        if (query.StartOnOrAfterDateTime is not null)
        {
            // Convert start after date to datetime with time starting at 00:00:00
            dbQuery = dbQuery.Where(p => p.StartTime >= query.StartOnOrAfterDateTime);

            // If no time params and search start day is today, then get all posts after the current time
            if (query.StartOnOrAfterTime is null && query.EndOnOrBeforeTime is null
                    && DateOnly.FromDateTime(query.StartOnOrAfterDateTime.Value).Equals(DateOnly.FromDateTime(DateTime.UtcNow)))
            {
                dbQuery = dbQuery.Where(p => p.StartTime >= DateTime.UtcNow);
            }
        }

        // Filter by posts that end before the given date
        if (query.EndOnOrBeforeDateTime is not null)
        {
            // Convert start before date to datetime with time ending at 23:59:59
            dbQuery = dbQuery.Where(p => p.EndTime <= query.EndOnOrBeforeDateTime);
        }

        // Filter by games
        if (query.GameIds.Count > 0)
        {
            dbQuery = dbQuery.Where(p => query.GameIds.Contains(p.Game.Id));
        }

        // Filter by tags
        // A post must have every tag in the filter
        foreach (int tagId in query.TagIds)
        {
            dbQuery = dbQuery.Where(p => p.Tags.Any(tr => tr.TagId == tagId));
        }

        // Filter by required players
        if (query.MinimumRequiredPlayers > 0)
        {
            // TODO
        }

        // Filter by search keywords
        dbQuery = dbQuery.Where(PostContainsKeywords(query.Keywords));

        // If start time is before end time, then wrap time around
        // e.g. startTime=11pm and endTime=2am then search between 11pm and 2am the next day
        // Note: This is needed to support other timezones
        if (query.StartOnOrAfterTime is not null && query.EndOnOrBeforeTime is not null
                && query.EndOnOrBeforeTime < query.StartOnOrAfterTime)
        {
            // Search for posts with a startTime that is greater than query.startTime or less than query.endTime
            dbQuery = dbQuery.Where(p => p.StartTime != null
                    && ((
                        ((DateTime)p.StartTime).Hour >= ((TimeOnly)query.StartOnOrAfterTime).Hour
                        && ((DateTime)p.StartTime).Minute >= ((TimeOnly)query.StartOnOrAfterTime).Minute
                    ) || (
                        ((DateTime)p.StartTime).Hour <= ((TimeOnly)query.EndOnOrBeforeTime).Hour
                        && ((DateTime)p.StartTime).Minute <= ((TimeOnly)query.EndOnOrBeforeTime).Minute
                    )));

            // Search for posts with an endTime that is less than query.endTime or greater than query.startTime
            dbQuery = dbQuery.Where(p => p.EndTime != null
                    && ((
                        ((DateTime)p.EndTime).Hour <= ((TimeOnly)query.EndOnOrBeforeTime).Hour
                        && ((DateTime)p.EndTime).Minute <= ((TimeOnly)query.EndOnOrBeforeTime).Minute
                    ) || (
                        ((DateTime)p.EndTime).Hour >= ((TimeOnly)query.StartOnOrAfterTime).Hour
                        && ((DateTime)p.EndTime).Minute >= ((TimeOnly)query.StartOnOrAfterTime).Minute
                    )));
        }
        else
        {
            // Filter by posts that start after the given time
            if (query.StartOnOrAfterTime is not null)
            {
                dbQuery = dbQuery.Where(p => p.StartTime != null
                        && ((DateTime)p.StartTime).Hour >= ((TimeOnly)query.StartOnOrAfterTime).Hour
                        && ((DateTime)p.StartTime).Minute >= ((TimeOnly)query.StartOnOrAfterTime).Minute);
            }

            // Filter by posts that end before the given time
            if (query.EndOnOrBeforeTime is not null)
            {
                dbQuery = dbQuery.Where(p => p.EndTime != null
                        && ((DateTime)p.EndTime).Hour <= ((TimeOnly)query.EndOnOrBeforeTime).Hour
                        && ((DateTime)p.EndTime).Minute <= ((TimeOnly)query.EndOnOrBeforeTime).Minute);
            }
        }

        return dbQuery;
    }

    private async Task<(List<UserProfile> users, int totalResults)> SearchConnectedUsers(UserQuery query)
    {
        var dbQuery = BuildConnectedUsersDbQuery(query);

        // Count the total number of results so that the UI can display the correct number of pages
        int totalResults = await dbQuery.CountAsync();

        // Sort results
        IOrderedQueryable<UserRelation> orderedDbQuery = query.SortDirection == SortDirection.Ascending
            ? dbQuery.OrderBy(
                SelectConnectedUserProperty(query.SortType))
            : dbQuery.OrderByDescending(
                SelectConnectedUserProperty(query.SortType));

        // Finally sort by Id to ensure order is consistent across calls.
        orderedDbQuery = orderedDbQuery.ThenBy(ur => ur.Id);

        List<UserRelation> userRelations = await orderedDbQuery
            .Skip((query.Page - 1) * query.Limit)
            .Take(query.Limit)
            .ToListAsync();

        // Go through each relation and attach the last message to the user profile we are returning
        List<UserProfile> userProfiles = userRelations.Select(ur =>
        {
            var userProfile = ur.User2.ToProfile(lastChatMessage: ur.Chat.LastMessage);
            return userProfile;
        }).ToList();

        return (userProfiles, totalResults);
    }

    private async Task<(List<UserProfile>, int TotalResults)> SearchAllUsers(UserQuery query)
    {
        var dbQuery = BuildUsersDbQuery(query);

        // Count the total number of results so that the UI can display the correct number of pages
        int totalResults = await dbQuery.CountAsync();

        // Sort results
        IOrderedQueryable<ApplicationUser> orderedDbQuery = query.SortDirection == SortDirection.Ascending
            ? dbQuery.OrderBy(
                SelectUserProperty(query.SortType))
            : dbQuery.OrderByDescending(
                SelectUserProperty(query.SortType));

        // Finally sort by Id to ensure order is consistent across calls.
        orderedDbQuery = orderedDbQuery.ThenBy(u => u.UserId);

        List<ApplicationUser> applicationUsers = await orderedDbQuery
            .Skip((query.Page - 1) * query.Limit)
            .Take(query.Limit)
            .ToListAsync();

        return (applicationUsers.ToProfiles().ToList(), totalResults);
    }
}
