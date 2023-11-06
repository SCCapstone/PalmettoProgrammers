namespace FU.API.Controllers;

using FU.API.Services;
using FU.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FU.API.Helpers;

/// <summary>
/// Handles accounts endpoint requests.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountsController : ControllerBase
{
    private readonly AccountsService _accountService;

    /// <summary>
    /// Initializes a new instance of the <see cref="AccountsController"/> class.
    /// </summary>
    /// <param name="accountService">Acount Service to use for buisness logic.</param>
    public AccountsController(AccountsService accountService)
    {
        _accountService = accountService;
    }

    /// <summary>
    /// Authenticates a user and gives them an access token.
    /// </summary>
    /// <param name="credentials">Credentials to verify.</param>
    /// <returns>An object with a Jwt token and timeout.</returns>
    [HttpPost]
    [Route("auth")]
    [AllowAnonymous]
    public async Task<IActionResult> Authenticate(Credentials credentials)
    {
        var authInfo = await _accountService.GetUserAuthInfo(credentials);

        if (authInfo is null)
        {
            return Unauthorized();
        }

        return Ok(authInfo);
    }

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="credentials">Credentials to register with.</param>
    /// <returns>Success or failure.</returns>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Register(Credentials credentials)
    {
        var user = await _accountService.Register(credentials);

        if (user is null)
        {
            return BadRequest();
        }

        return Ok();
    }

    /// <summary>
    /// Gets the current signed in user.
    /// </summary>
    /// <returns>Returns the username and id of the user.</returns>
    [HttpGet]
    public IActionResult GetAccount()
    {
        string? userIdString = (string?)HttpContext.Items[CustomContextItems.UserId];
        int? userId = int.Parse(userIdString ?? string.Empty);
        if (userId is null)
        {
            return Problem("Could not parse userId from Jwt");
        }

        var accountInfo = _accountService.GetInfo((int)userId);

        if (accountInfo is null)
        {
            return Problem("Could not find account");
        }

        return Ok(accountInfo);
    }
}