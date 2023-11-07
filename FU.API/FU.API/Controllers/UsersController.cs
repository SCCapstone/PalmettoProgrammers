namespace FU.API.Controllers;

using FU.API.Helpers;
using FU.API.Models;
using FU.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Route("{userId}")]
    public async Task<IActionResult> GetUserProfile(int userId)
    {
        var profile = await _userService.GetUserProfile(userId);

        if (profile is null)
        {
            return NotFound();
        }

        return Ok(profile);
    }

    [Authorize]
    [HttpPatch]
    [Route("{userId}")]
    public async Task<IActionResult> UpdateProfile([FromRoute] int userId, [FromBody] UserProfile profileChanges)
    {
        // Check if the user to update is the authenticated user
        int? authUserId = int.Parse((string?)HttpContext.Items[CustomContextItems.UserId] ?? string.Empty);
        if (userId != authUserId)
        {
            return Forbid();
        }

        // Allows updateUserProfile to find the user to update
        // Overrides any client given id that may differ from userId.
        profileChanges.Id = userId;

        var newProfile = await _userService.UpdateUserProfile(profileChanges);
        return Ok(newProfile);
    }
}