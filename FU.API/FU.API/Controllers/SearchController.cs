namespace FU.API.Controllers;

using FU.API.DTOs.Post;
using FU.API.DTOs.Search;
using FU.API.Helpers;
using FU.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet]
    [Route("posts")]
    public async Task<IActionResult> SearchPosts([FromQuery] PostSearchRequestDTO request)
    {
        // Ensure if start or end time is set, the other is set
        // This prevents unexpected assumptions from translating client time to utc time
        if (request.StartOnOrAfterTime is null ^ request.EndOnOrBeforeTime is null)
        {
            return UnprocessableEntity("Start and end time must both be set, or both be null");
        }

        (var posts, var totalResults) = await _searchService.SearchPosts(request.ToPostQuery());
        var postDtos = new List<PostResponseDTO>(posts.Count);

        // Go through each post and check if the user has joined the post
        var user = await _searchService.GetCurrentUser(User);

        if (user is not null)
        {
            foreach (var post in posts)
            {
                var joined = await _searchService.HasJoinedPost(user.UserId, post.Id);
                postDtos.Add(post.ToDto(hasJoined: joined));
            }
        }
        else
        {
            postDtos = posts.ToDtos().ToList();
        }

        Response.Headers.Add("X-total-count", totalResults.ToString());

        return Ok(postDtos);
    }

    [HttpGet]
    [Route("users")]
    public async Task<IActionResult> SearchUsers([FromQuery] UserSearchRequestDTO request)
    {
        (var users, var totalResults) = await _searchService.SearchUsers(request.ToUserQuery());

        Response.Headers.Add("X-total-count", totalResults.ToString());

        return Ok(users);
    }
}
