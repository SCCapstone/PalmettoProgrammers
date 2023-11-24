namespace FU.API.Interfaces;

using FU.API.Models;

public interface ISocialService : ICommonService
{
    Task<IEnumerable<Post>> GetUsersAssociatedPosts(int userId);

    Task<IEnumerable<Group>> GetUsersGroups(int userId);

    Task<IEnumerable<ApplicationUser>> GetUsersPlayers(int userId);
}
