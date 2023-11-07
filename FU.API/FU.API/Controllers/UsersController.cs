namespace FU.API.Controllers;

using FU.API.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Route("{userId}")]
    public async Task<IActionResult> GetUserProfile(int userId)
    {
        var profile = await _userService.GetUserProfile(userId);

        if (profile is null)
        {
            return NotFound();
        }

        return Ok(profile);
    }
}