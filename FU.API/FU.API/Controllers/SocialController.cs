namespace FU.API.Controllers;

using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SocialController : ControllerBase
{
    private readonly ISocialService _socialService;

    public SocialController(ISocialService socialService)
    {
        _socialService = socialService;
    }

    [HttpGet]
    [Route("posts")]
    public async Task<IActionResult> GetUsersAssociatedPosts()
    {
        var user = await _socialService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var posts = await _socialService.GetUsersAssociatedPosts(user.UserId);

        var response = posts.ToDtos();

        return Ok(response);
    }

    [HttpGet]
    [Route("groups")]
    public async Task<IActionResult> GetUsersGroups()
    {
        var user = await _socialService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var groups = await _socialService.GetUsersGroups(user.UserId);

        var response = groups.ToCardDtos();

        return Ok(response);
    }

    [HttpGet]
    [Route("friends")]
    public async Task<IActionResult> GetUsersFriends()
    {
        var user = await _socialService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var friends = await _socialService.GetUsersPlayers(user.UserId);

        var response = friends.ToCardDtos();

        return Ok(response);
    }
}
