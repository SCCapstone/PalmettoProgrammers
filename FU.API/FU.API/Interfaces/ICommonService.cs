namespace FU.API.Interfaces;

using FU.API.Models;
using System.Security.Claims;

/// <summary>
/// Interface for the common service.
/// </summary>
public interface ICommonService
{
    /// <summary>
    /// Gets the current user from the claims.
    /// </summary>
    /// <param name="claims">The users claims.</param>
    /// <returns>Potetinally current signed in user.</returns>
    Task<ApplicationUser?> GetCurrentUser(ClaimsPrincipal claims);

    /// <summary>
    /// Gets a user by their id.
    /// </summary>
    /// <param name="userId">The id of the user to get.</param>
    /// <returns>Potetinally the user with the id.</returns>
    Task<ApplicationUser?> GetUser(int userId);

    /// <summary>
    /// Checks if a user has joined a post.
    /// </summary>
    /// <param name="userId">The id of the user.</param>
    /// <param name="postId">The id of the post to check.</param>
    /// <returns>If the user has joined the post.</returns>
    Task<bool> HasJoinedPost(int userId, int postId);
}