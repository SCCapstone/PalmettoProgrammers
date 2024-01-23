namespace FU.API.Controllers;

using FU.API.DTOs.Post;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] PostRequestDTO dto)
    {
        var user = await _postService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var post = dto.ToModel();
        post.Creator = user;

        var newPost = await _postService.CreatePost(post);

        return CreatedAtRoute(string.Empty, new { postId = newPost.Id }, newPost.ToDto());
    }

    [HttpGet]
    [Route("{postId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPost(int postId)
    {
        var post = await _postService.GetPost(postId);

        if (post is null)
        {
            return NotFound();
        }

        var hasJoinedPost = false;
        var user = await _postService.GetCurrentUser(User);

        if (user is not null)
        {
            hasJoinedPost = await _postService.HasJoinedPost(user.UserId, postId);
        }

        var response = post.ToDto(hasJoined: hasJoinedPost);

        return Ok(response);
    }

    [HttpPost]
    [Route("{postId}/users/current")]
    public async Task<IActionResult> JoinPost(int postId)
    {
        var user = await _postService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var post = await _postService.GetPost(postId);

        if (post is null)
        {
            return NotFound();
        }

        await _postService.JoinPost(post.Id, user);

        return NoContent();
    }

    [HttpDelete]
    [Route("{postId}/users/current")]
    public async Task<IActionResult> LeavePost(int postId)
    {
        var user = await _postService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var post = await _postService.GetPost(postId);

        if (post is null)
        {
            return NotFound();
        }

        await _postService.LeavePost(post.Id, user);

        return NoContent();
    }

    [HttpGet]
    [Route("{postId}/users")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPostUsers(int postId)
    {
        var post = await _postService.GetPost(postId);

        if (post is null)
        {
            return NotFound();
        }

        var users = await _postService.GetPostUsers(post.Id);

        var response = users.ToProfiles();

        return Ok(response);
    }
}