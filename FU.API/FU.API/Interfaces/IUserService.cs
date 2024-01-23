namespace FU.API.Interfaces;

using FU.API.Models;

public interface IUserService : ICommonService
{
    Task<ApplicationUser?> GetUserByName(string username);

    Task<ApplicationUser?> GetUserById(int userId);

    Task<UserProfile?> UpdateUserProfile(UserProfile profileChanges);

    Task<IEnumerable<Post>> GetUsersAssociatedPosts(int userId, int limit, int offset);

    Task<IEnumerable<Group>> GetUsersGroups(int userId, int limit, int offset);

    Task<IEnumerable<ApplicationUser>> GetUsersPlayers(int userId, int limit, int offset);

    Task<bool> AreFriends(int user1Id, int user2Id);
}
