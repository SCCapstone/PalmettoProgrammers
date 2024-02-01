namespace FU.API.Services;

using System.Linq.Expressions;
using FU.API.Data;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;
using LinqKit;

public class SearchService : CommonService, ISearchService
{
    private readonly AppDbContext _dbContext;

    public SearchService(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Post>> SearchPosts(PostQuery query)
    {
        var dbQuery = _dbContext.Posts.Select(p => p);

        // Filters are addded one at a time
        // Generally filer out as much as as possible first

        // Only show active posts - maybe in future we can parameterize this
        dbQuery = dbQuery.Where(p => p.Status == PostStatus.NoSchedule || p.Status == PostStatus.OnGoing);
        // Filter by posts that start after the given date
        if (query.StartOnOrAfterDate is not null)
        {
            // Convert start after date to datetime with time starting at 00:00:00
            DateTime startAfterDateTime = ((DateOnly)query.StartOnOrAfterDate).ToDateTime(new TimeOnly(0, 0, 0));
            dbQuery = dbQuery.Where(p => p.StartTime >= startAfterDateTime);
        }

        // Filter by posts that end before the given date
        if (query.EndOnOrBeforeDate is not null)
        {
            // Convert start before date to datetime with time ending at 23:59:59
            DateTime endBeforeDateTime = ((DateOnly)query.EndOnOrBeforeDate).ToDateTime(new TimeOnly(23, 59, 59));
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
        dbQuery = dbQuery.Where(ContainsKeywords(query.Keywords));

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
                    && ((DateTime)p.EndTime).Hour >= ((TimeOnly)query.EndOnOrBeforeTime).Hour
                    && ((DateTime)p.EndTime).Minute >= ((TimeOnly)query.EndOnOrBeforeTime).Minute);
        }

        // Sort results
        IOrderedQueryable<Post> orderedDbQuery = query.SortBy?.Direction == SortDirection.Ascending
            ? dbQuery.OrderBy(
                SelectPostProperty(query.SortBy?.Type))
            : dbQuery.OrderByDescending(
                SelectPostProperty(query.SortBy?.Type));

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

    private static Expression<Func<Post, bool>> ContainsKeywords(List<string> keywords)
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

    private static Expression<Func<Post, object>> SelectPostProperty(SortType? sortType)
    {
        return sortType switch
        {
            SortType.NewestCreated => (post) => post.CreatedAt,
            SortType.Title => (post) => post.Title,
            SortType.EarliestToScheduledTime => (post) => post.StartTime ?? post.CreatedAt,
            _ => (post) => post.CreatedAt,
        };
    }
}
