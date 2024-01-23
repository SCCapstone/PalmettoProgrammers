namespace FU.API.Interfaces;

using FU.API.Models;

public interface ISearchService : ICommonService
{
    Task<List<Post>> SearchPosts(PostQuery query);
}
