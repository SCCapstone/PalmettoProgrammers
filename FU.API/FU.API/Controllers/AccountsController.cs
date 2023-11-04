using FU.API.DTOs;
using FU.API.Services;
using FU.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FU.API.Helpers;
using FU.API.Exceptoins;

namespace FU.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class AccountsController : ControllerBase
{
    public readonly AccountsService _accountService;

    public AccountsController(AccountsService accountService)
    {
        _accountService = accountService;
    }

    [HttpPost]
    [Route("auth")]
    [AllowAnonymous]
    public async Task<IActionResult> Authenticate(Credentials credentials)
    {
        var token = await _accountService.GetUserAuthToken(credentials);

        if (token is null) return Unauthorized();

        return Ok(new TokenResponseDTO(token));
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Register(Credentials credentials)
    {
        UserCredentials? userCredentials;
        try
        {
            userCredentials = await _accountService.Register(credentials);
        }
        catch (DuplicateUserException)
        {
            return Conflict();
        }

        if (userCredentials is null) return Unauthorized();

        return Ok();
    }

    [HttpGet]
    public IActionResult GetAccount()
    {
        string? userIdString = (string?)HttpContext.Items[CustomContextItems.UserId];
        int? userId = int.Parse(userIdString ?? "");
        if (userId is null) return Problem("Could not parse userId from Jwt");

        var accountInfo = _accountService.getInfo((int)userId);

        if (accountInfo is null) return Problem("Could not find account");

        return Ok(accountInfo);
    }
}