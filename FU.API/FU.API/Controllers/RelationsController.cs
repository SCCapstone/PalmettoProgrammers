namespace FU.API.Controllers;

using FU.API.DTOs.Search;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Interfaces;
using FU.API.Models;
using FU.API.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RelationsController : ControllerBase
{
    private readonly IRelationService _relationService;
    private readonly ISearchService _searchService;

    public RelationsController(IRelationService relationService, ISearchService searchService)
    {
        _relationService = relationService;
        _searchService = searchService;
    }

    // POST: api/relations/{userId}/{userAction}
    [HttpPost("{userId}/{userAction}")]
    public async Task<IActionResult> HandleRelationAction(int userId, string userAction)
    {
        var currentUser = await _relationService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        // Try to get the value from userAction as an enum
        if (!Enum.TryParse<UserRelationAction>(userAction, ignoreCase: true, out var action))
        {
            return BadRequest("Invalid action");
        }

        await _relationService.HandleRelationAction(currentUser.UserId, userId, action);
        return Ok();
    }

    // DELETE: api/relations/{userId}
    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteRelation(int userId)
    {
        var user = await _relationService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        await _relationService.RemoveRelation(user.UserId, userId);
        return Ok();
    }

    // GET: api/relations/{userId}/status
    [HttpGet("{userId}/status")]
    public async Task<IActionResult> GetRelationStatus(int userId)
    {
        var currentUser = await _relationService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        var relation = await _relationService.GetRelation(currentUser.UserId, userId)
            ?? new UserRelation { Status = UserRelationStatus.None };

        var response = relation.ToDto();
        return Ok(response);
    }

    // GET: api/relations/{userId}/{relationStatus}
    [HttpGet("{userId}/{relationStatus}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRelations(int userId, [RelationStatus] string relationStatus, [FromQuery] UserSearchRequestDTO request)
    {
        var currentUser = await _relationService.GetCurrentUser(User);
        var userIsRequester = currentUser?.UserId == userId;

        var status = Enum.Parse<UserRelationStatus>(relationStatus, ignoreCase: true);

        if (!userIsRequester && status != UserRelationStatus.Friends)
        {
            throw new ForbidException($"You are not allowed to view this user's {status.ToString()} relations");
        }

        var query = request.ToUserQuery();
        query.RelationStatus = status;
        query.UserId = userId;

        (var relatedUsers, var totalResults) = await _searchService.SearchUsers(query);

        Response.Headers.Add("X-total-count", totalResults.ToString());

        return Ok(relatedUsers);
    }
}
