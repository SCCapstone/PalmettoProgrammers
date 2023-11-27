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

        var response = post.ToDto();

        return Ok(response);
    }
}