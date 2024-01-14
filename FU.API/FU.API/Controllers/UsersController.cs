namespace FU.API.Controllers;

using FU.API.DTOs.Post;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Route("{userString}")]
    public async Task<IActionResult> GetUserProfile(string userString)
    {
        ApplicationUser? user;
        if (int.TryParse(userString, out int userId))
        {
            user = await _userService.GetUserById(userId);
        }
        else if (userString == "current")
        {
            user = await _userService.GetCurrentUser(User);
        }
        else
        {
            user = await _userService.GetUserByName(userString);
        }

        if (user is null)
        {
            return NotFound();
        }

        var response = user.ToProfile();
        var currentUser = await _userService.GetCurrentUser(User);

        if (userString == "current" || currentUser is null)
        {
            return Ok(response);
        }

        response.FriendsWithCurrentUser = await _userService.AreFriends(user.UserId, currentUser.UserId);

        return Ok(response);
    }

    [Authorize]
    [HttpPatch]
    [Route("current")] // Will never change anyone else's profile
    public async Task<IActionResult> UpdateProfile([FromBody] UserProfile profileChanges)
    {
        // Check if the user to update is the authenticated user
        bool isParseSuccess = int.TryParse((string?)HttpContext.Items[CustomContextItems.UserId], out int userId);
        if (!isParseSuccess)
        {
            return Unauthorized();
        }

        // Allows updateUserProfile to find the user to update
        // Overrides any client given id that may differ from userId.
        profileChanges.Id = userId;

        var newProfile = await _userService.UpdateUserProfile(profileChanges);
        return Ok(newProfile);
    }

    [HttpGet]
    [Route("current/connected/posts")]
    public async Task<IActionResult> GetUsersAssociatedPosts([FromQuery] int limit = 10, [FromQuery] int offset = 0)
    {
        var user = await _userService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var posts = await _userService.GetUsersAssociatedPosts(user.UserId, limit, offset);

        var response = new List<PostResponseDTO>(posts.Count());

        // for each resonse set has joined to true
        foreach (var post in posts)
        {
            response.Add(post.ToDto(hasJoined: true));
        }

        return Ok(response);
    }

    [HttpGet]
    [Route("current/connected/groups")]
    public async Task<IActionResult> GetUsersGroups([FromQuery] int limit = 10, [FromQuery] int offset = 0)
    {
        var user = await _userService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var groups = await _userService.GetUsersGroups(user.UserId, limit, offset);

        var response = groups.ToSimpleDtos();

        return Ok(response);
    }

    [HttpGet]
    [Route("current/connected/players")]
    public async Task<IActionResult> GetUsersPlayers([FromQuery] int limit = 10, [FromQuery] int offset = 0)
    {
        var user = await _userService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var players = await _userService.GetUsersPlayers(user.UserId, limit, offset);

        var response = players.Select(p => p.ToProfile());

        return Ok(response);
    }
}