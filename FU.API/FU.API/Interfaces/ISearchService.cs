namespace FU.API.Interfaces;

using FU.API.Models;

/// <summary>
/// Interface for the search service.
/// </summary>
public interface ISearchService : ICommonService
{
    /// <summary>
    /// Search for posts.
    /// </summary>
    /// <param name="query">The post query.</param>
    /// <returns>The paginated posts, and total number of results.</returns>
    Task<(List<Post>, int TotalResults)> SearchPosts(PostQuery query);

    /// <summary>
    /// Search for users.
    /// </summary>
    /// <param name="query">The users query.</param>
    /// <returns>The paginated users, and total number of results.</returns>
    Task<(List<UserProfile>, int TotalResults)> SearchUsers(UserQuery query);
}
