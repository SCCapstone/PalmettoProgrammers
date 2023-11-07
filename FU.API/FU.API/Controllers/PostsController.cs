namespace FU.API.Controllers;

using FU.API.Models;
using FU.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly PostService _postService;

    public PostsController(PostService postService)
    {
        _postService = postService;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost(Post post)
    {
        var newPost = await _postService.CreatePost(post);

        if (newPost is null)
        {
            return BadRequest();
        }

        return Created($"posts/{newPost.Id}", newPost);
    }

    [AllowAnonymous]
    [HttpGet]
    [Route("{postId}")]
    public async Task<IActionResult> GetPost(int postId)
    {
        var post = await _postService.GetPost(postId);

        if (post is null)
        {
            return NotFound();
        }

        return Ok(post);
    }
}