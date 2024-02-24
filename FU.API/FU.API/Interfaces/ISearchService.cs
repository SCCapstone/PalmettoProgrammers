namespace FU.API.Interfaces;

using FU.API.Models;

public interface ISearchService : ICommonService
{
    Task<List<Post>> SearchPosts(PostQuery query);

    Task<List<UserProfile>> SearchUsers(UserQuery query);
}
