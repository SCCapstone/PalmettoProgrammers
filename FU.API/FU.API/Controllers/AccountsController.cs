namespace FU.API.Controllers;

using FU.API.Services;
using FU.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FU.API.Helpers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class AccountsController : ControllerBase
{
    private readonly AccountsService _accountService;

    public AccountsController(AccountsService accountService)
    {
        _accountService = accountService;
    }

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

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Register(Credentials credentials)
    {
        UserCredentials? userCredentials = await _accountService.Register(credentials);

        if (userCredentials is null) return Unauthorized();

        return Ok();
    }

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