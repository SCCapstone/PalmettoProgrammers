namespace FU.API.Controllers;

using FU.API.DTOs.Search;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Interfaces;
using FU.API.Models;
using FU.API.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RelationsController : ControllerBase
{
    private readonly IRelationService _relationService;

    public RelationsController(IRelationService relationService)
    {
        _relationService = relationService;
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

        var relation = await _relationService.GetRelation(currentUser.UserId, userId);

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

        var query = request.ToUserQuery();
        query.RelationStatus = status;
        query.UserId = userId;

        var relatedUsers = await _relationService.GetRelations(query, userIsRequester);

        return Ok(relatedUsers);
    }
}
