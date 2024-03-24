namespace FU.API.Interfaces;

using FU.API.Models;
using System.Security.Claims;

public interface ICommonService
{
    Task<ApplicationUser?> GetAuthorizedUser(ClaimsPrincipal claims, bool mustBeConfirmed = true);

    Task<ApplicationUser?> GetUser(int userId);

    Task<ApplicationUser?> GetUser(string username);

    Task<bool> HasJoinedPost(int userId, int postId);

    Task<UserRelation?> GetRelation(int initiatedById, int otherUserId);
}