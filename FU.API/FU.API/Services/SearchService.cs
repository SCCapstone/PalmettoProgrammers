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
    private readonly AppDbContext _dbContext;

    public SearchService(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<UserProfile>> SearchUsers(UserQuery query)
    {
        var dbQuery = _dbContext.Users.Select(p => p);

        dbQuery = dbQuery.Where(UserContainsKeywords(query.Keywords));

        // Sort results
        IOrderedQueryable<ApplicationUser> orderedDbQuery = query.SortDirection == SortDirection.Ascending
            ? dbQuery.OrderBy(
                SelectUserProperty(query.SortType))
            : dbQuery.OrderByDescending(
                SelectUserProperty(query.SortType));

        // Always end ordering by Id to ensure order is unique. This ensures order is consistent across calls.
        orderedDbQuery = orderedDbQuery.ThenBy(u => u.UserId);

        List<ApplicationUser> applicationUsers = await orderedDbQuery
            .Skip(query.Offset)
            .Take(query.Limit)
            .ToListAsync();

        return applicationUsers.ToProfiles().ToList();
    }

    public async Task<List<Post>> SearchPosts(PostQuery query)
    {
        var dbQuery = _dbContext.Posts.Select(p => p);

        // Filters are addded one at a time
        // Generally filer out as much as as possible first

        // Filter by posts that start after the given date
        if (query.StartOnOrAfterDate is not null)
        {
            // Convert start after date to datetime with time starting at 00:00:00
            DateTime startAfterDateTime = ((DateOnly)query.StartOnOrAfterDate).ToDateTime(new TimeOnly(0, 0, 0), DateTimeKind.Utc);
            dbQuery = dbQuery.Where(p => p.StartTime >= startAfterDateTime);

            // If no time params and search start day is today, then get all posts after the current time
            if (query.StartOnOrAfterTime is null && query.EndOnOrBeforeTime is null && query.StartOnOrAfterDate.Equals(DateOnly.FromDateTime(DateTime.Now)))
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

        // Sort results
        IOrderedQueryable<Post> orderedDbQuery = query.SortDirection == SortDirection.Ascending
            ? dbQuery.OrderBy(
                SelectPostProperty(query.SortType))
            : dbQuery.OrderByDescending(
                SelectPostProperty(query.SortType));

        // Always end ordering by Id to ensure order is unique. This ensures order is consistent across calls.
        orderedDbQuery = orderedDbQuery.ThenBy(p => p.Id);

        return await orderedDbQuery
                .Skip(query.Offset)
                .Take(query.Limit)
                .Include(p => p.Creator)
                .Include(p => p.Tags).ThenInclude(pt => pt.Tag)
                .Include(p => p.Game)
                .ToListAsync();
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
            PostSortType.EarliestToScheduledTime => (post) => post.StartTime ?? post.CreatedAt,
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
}
