namespace FU.API.Interfaces;

using FU.API.Models;

public interface ISocialService : ICommonService
{
    Task<IEnumerable<Post>> GetUsersAssociatedPosts(int userId, int limit, int offset);

    Task<IEnumerable<Group>> GetUsersGroups(int userId, int limit, int offset);

    Task<IEnumerable<ApplicationUser>> GetUsersPlayers(int userId, int limit, int offset);
}
