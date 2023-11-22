namespace FU.API.Services;

using System.Linq.Expressions;
using FU.API.Data;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;

public class SearchService
{
    private readonly AppDbContext _dbContext;

    public SearchService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Post>> SearchPosts(PostQuery query)
    {
        var dbQuery = _dbContext.Posts.Select(p => p);

        // Filters are addded one at a time, generally by the amount of posts they filter out

        // Filter by games
        if (query.Games.Count > 0)
        {
            dbQuery = dbQuery.Where(p => query.Games.Contains(p.Game));
        }

        // Filter by tags
        // A post must have every tag in the filter
        foreach (var tag in query.Tags)
        {
            // TODO
        }

        // Filter by posts after a time
        if (query.After is not null)
        {
            dbQuery = dbQuery.Where(p => p.StartTime >= query.After);
        }

        // Filter by required players
        if (query.MinimumRequiredPlayers > 0)
        {
            // TODO
        }

        // Filter by description keywords
        foreach (string keyword in query.DescriptionContains)
        {
            // TODO don't require every keyword to match
            dbQuery = dbQuery.Where(p => p.Description.Contains(keyword));
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