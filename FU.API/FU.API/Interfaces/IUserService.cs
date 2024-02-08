namespace FU.API.Interfaces;

using FU.API.Models;

public interface IUserService : ICommonService
{
    Task<UserProfile?> GetUserProfile(int userId);

    Task<UserProfile?> UpdateUserProfile(UserProfile profileChanges);

    Task<IEnumerable<Post>> GetUsersAssociatedPosts(PostQuery query);

    Task<IEnumerable<Group>> GetUsersGroups(int userId, int limit, int offset);
}
