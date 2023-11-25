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
    public async Task<IActionResult> GetUsersAssociatedPosts(int limit = 20, int offset = 1)
    {
        var user = await _socialService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var posts = await _socialService.GetUsersAssociatedPosts(user.UserId, limit, offset);

        var response = posts.ToDtos();

        return Ok(response);
    }

    [HttpGet]
    [Route("groups")]
    public async Task<IActionResult> GetUsersGroups(int limit = 20, int offset = 1)
    {
        var user = await _socialService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var groups = await _socialService.GetUsersGroups(user.UserId, limit, offset);

        var response = groups.ToCardDtos();

        return Ok(response);
    }

    [HttpGet]
    [Route("friends")]
    public async Task<IActionResult> GetUsersPlayers(int limit = 20, int offset = 1)
    {
        var user = await _socialService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var friends = await _socialService.GetUsersPlayers(user.UserId, limit, offset);

        var response = friends.ToCardDtos();

        return Ok(response);
    }
}
