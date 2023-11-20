namespace FU.API.Controllers;

using FU.API.DTOs.Search;
using FU.API.Helpers;
using FU.API.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly SearchService _searchService;

    public SearchController(SearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet]
    [Route("posts")]
    public async Task<IActionResult> SearchPosts([FromQuery] PostSearchRequestDTO request)
    {
        var posts = await _searchService.SearchPosts(request.ToPostQuery());
        return Ok(posts);
    }
}