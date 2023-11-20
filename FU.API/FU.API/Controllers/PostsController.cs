namespace FU.API.Controllers;

using FU.API.DTOs.Post;
using FU.API.Helpers;
using FU.API.Interfaces;
using FU.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;
    private readonly AccountsService _accountsService;

    public PostsController(IPostService postService, AccountsService accountsService)
    {
        _postService = postService;
        _accountsService = accountsService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreatePost([FromBody] PostRequestDTO dto)
    {
        var user = await _accountsService.GetCurrentUser(User);

        if (user is null)
        {
            return Unauthorized("User is not signed in");
        }

        var post = dto.ToModel();
        post.Creator = user;

        var newPost = await _postService.CreatePost(post);

        return await GetPost(newPost.Id);
    }

    [HttpGet]
    [Route("{postId}")]
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

    [HttpGet]
    public async Task<IActionResult> GetPosts()
    {
        var posts = await _postService.GetPosts();

        var response = posts.ToDtos();

        return Ok(response);
    }
}