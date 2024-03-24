namespace FU.API.Controllers;

using FU.API.DTOs.Post;
using FU.API.DTOs.Search;
using FU.API.Helpers;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Handles search requests.
/// </summary>
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
        var user = await _searchService.GetAuthorizedUser(User);

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

        // Go through each user and check if the user has a relation with them
        var user = await _searchService.GetAuthorizedUser(User);

        Response.Headers.Add("X-total-count", totalResults.ToString());

        if (user is not null)
        {
            foreach (var u in users)
            {
                // Skip if we are checking the relation with ourselves
                if (u.Id == user.UserId)
                {
                    continue;
                }

                var relation = await _searchService.GetRelation(user.UserId, u.Id);
                u.RelationStatus = relation is not null ? relation.Status.ToString() : UserRelationStatus.None.ToString();
            }
        }

        return Ok(users);
    }
}
