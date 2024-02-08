namespace FU.API.Controllers;

using FU.API.DTOs.Post;
using FU.API.DTOs.Search;
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
    [Route("{userIdString}")]
    public async Task<IActionResult> GetUserProfile(string userIdString)
    {
        // if the route is current, get userId from auth token, otherwise use the given id
        int userId;
        if (userIdString == "current")
        {
            bool isParseSuccess = int.TryParse((string?)HttpContext.Items[CustomContextItems.UserId], out userId);
            if (!isParseSuccess)
            {
                return Unauthorized();
            }
        }
        else
        {
            bool isParseSuccess = int.TryParse(userIdString, out userId);
            if (!isParseSuccess)
            {
                return NotFound();
            }
        }

        var profile = await _userService.GetUserProfile(userId);

        if (profile is null)
        {
            return NotFound();
        }

        return Ok(profile);
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
    public async Task<IActionResult> GetUsersAssociatedPosts([FromQuery] PostSearchRequestDTO request)
    {
        var user = await _userService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var query = request.ToPostQuery();
        query.UserId = user.UserId;

        var posts = await _userService.GetUsersAssociatedPosts(query);

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
}