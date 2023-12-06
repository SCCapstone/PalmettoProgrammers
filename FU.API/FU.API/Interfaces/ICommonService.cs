namespace FU.API.Interfaces;

using FU.API.Models;
using System.Security.Claims;

public interface ICommonService
{
    Task<ApplicationUser?> GetCurrentUser(ClaimsPrincipal claims);

    Task<ApplicationUser?> GetUser(int userId);

    Task<bool> HasJoinedPost(int userId, int postId);
}