using ForcesUnite.DTOs;
using ForcesUnite.Services;
using ForcesUnite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ForcesUnite.Helpers;

namespace ForcesUnite.Controllers;

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
    public async Task<IActionResult> Authenticate(LoginRequestDTO request)
    {
        Credentials credentials = new()
        {
            Username = request.Username,
            Password = request.Password,
        };

        if (!_accountService.Authenticate(credentials)) return Unauthorized();

        string? token = await _accountService.GetAuthToken(credentials);

        if (token is null) return Unauthorized();

        LoginResponseDTO response = new()
        {
            Token = token
        };

        return Ok(response);
    }
}