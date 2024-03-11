namespace FU.API.Interfaces;

using FU.API.Models;

public interface ISearchService : ICommonService
{
    Task<(List<Post>, int TotalResults)> SearchPosts(PostQuery query);

    Task<(List<UserProfile>, int TotalResults)> SearchUsers(UserQuery query);
}
