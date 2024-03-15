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
    private static readonly DateTime DefaultStartTime = DateTime.MinValue;

    private readonly AppDbContext _dbContext;

    public SearchService(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(List<UserProfile>, int TotalResults)> SearchUsers(UserQuery query)
    {
        var dbQuery = GetUsersDbQuery(query);

        dbQuery = dbQuery.Where(UserContainsKeywords(query.Keywords));

        // Count the total number of results so that the UI can display the correct number of pages
        var totalResults = await dbQuery.CountAsync();

        // Sort results
        IOrderedQueryable<ApplicationUser> orderedDbQuery = query.SortDirection == SortDirection.Ascending
            ? dbQuery.OrderBy(
                SelectUserProperty(query.SortType))
            : dbQuery.OrderByDescending(
                SelectUserProperty(query.SortType));

        // Always end ordering by Id to ensure order is unique. This ensures order is consistent across calls.
        orderedDbQuery = orderedDbQuery.ThenBy(u => u.UserId);

        List<ApplicationUser> applicationUsers = await orderedDbQuery
            .Skip((query.Page - 1) * query.Limit)
            .Take(query.Limit)
            .ToListAsync();

        return (applicationUsers.ToProfiles().ToList(), totalResults);
    }

    public async Task<(List<Post>, int TotalResults)> SearchPosts(PostQuery query)
    {
        var dbQuery = GetPostsDbQuery(query);

        // Filters are addded one at a time
        // Generally filer out as much as as possible first

        // Filter by posts that start after the given date
        if (query.StartOnOrAfterDate is not null)
        {
            // Convert start after date to datetime with time starting at 00:00:00
            DateTime startAfterDateTime = ((DateOnly)query.StartOnOrAfterDate).ToDateTime(new TimeOnly(0, 0, 0), DateTimeKind.Utc);
            dbQuery = dbQuery.Where(p => p.StartTime >= startAfterDateTime);

            // If no time params and search start day is today, then get all posts after the current time
            if (query.StartOnOrAfterTime is null && query.EndOnOrBeforeTime is null && query.StartOnOrAfterDate.Equals(DateOnly.FromDateTime(DateTime.UtcNow)))
            {
                dbQuery = dbQuery.Where(p => p.StartTime >= DateTime.UtcNow);
            }
        }

        // Filter by posts that end before the given date
        if (query.EndOnOrBeforeDate is not null)
        {
            // Convert start before date to datetime with time ending at 23:59:59
            DateTime endBeforeDateTime = ((DateOnly)query.EndOnOrBeforeDate).ToDateTime(new TimeOnly(23, 59, 59), DateTimeKind.Utc);
            dbQuery = dbQuery.Where(p => p.EndTime <= endBeforeDateTime);
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

        // Count the total number of results so that the UI can display the correct number of pages
        var totalResults = await dbQuery.CountAsync();

        // Sort results
        IOrderedQueryable<Post> orderedDbQuery = query.SortDirection == SortDirection.Ascending
            ? dbQuery.OrderBy(
                SelectPostProperty(query.SortType))
            : dbQuery.OrderByDescending(
                SelectPostProperty(query.SortType));

        // Always end ordering by Id to ensure order is unique. This ensures order is consistent across calls.
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
            PostSortType.EarliestToScheduledTime => (post) => post.StartTime ?? DefaultStartTime,
            _ => (post) => post.CreatedAt,
        };
    }

    private static Expression<Func<ApplicationUser, object>> SelectUserProperty(UserSortType? sortType)
    {
        return sortType switch
        {
            UserSortType.Username => (user) => user.NormalizedUsername,
            _ => (user) => user.NormalizedUsername,
        };
    }

    /// <summary>
    /// Gets the database query for users based on the given query.
    /// </summary>
    /// <param name="query">The query.</param>
    /// <returns>The users to query. Either related to user with UserId, or all users.</returns>
    private IQueryable<ApplicationUser> GetUsersDbQuery(UserQuery query)
    {
        if (query.UserId is not null && query.RelationStatus is not null)
        {
            return _dbContext.UserRelations
                .Where(ur => ur.User1Id == query.UserId && ur.Status == query.RelationStatus)
                .Select(ur => ur.User2);
        }
        else
        {
            return _dbContext.Users.Select(u => u);
        }
    }

    private IQueryable<Post> GetPostsDbQuery(PostQuery query)
    {
        if (query.UserId is not null)
        {
            return _dbContext.Posts
                .Where(p => p.Chat.Members.Any(m => m.UserId == query.UserId))
                .Select(p => p);
        }
        else
        {
            return _dbContext.Posts.Select(p => p);
        }
    }
}
