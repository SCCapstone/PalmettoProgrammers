namespace FU.API.Controllers;

using FU.API.Services;
using FU.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FU.API.Helpers;
using FU.API.Exceptions;
using FU.API.DTOs;

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
    /// <param name="loginDetails">Login details.</param>
    /// <returns>An object with a Jwt token and timeout.</returns>
    [HttpPost]
    [Route("auth")]
    [AllowAnonymous]
    public async Task<IActionResult> Authenticate(LoginRequestDTO loginDetails)
    {
        var credentials = new Credentials
        {
            Username = loginDetails.Username,
            Password = loginDetails.Password
        };

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

        return Ok(accountInfo.ToDTO());
    }

    // Updates the current user's credentials. The current user is obtained from the jwt token.
    [HttpPatch]
    public async Task<IActionResult> UpdateAccountCredentials(UpdateCredentailsDTO newCredentials)
    {
        var user = await _accountService.GetCurrentUser(User) ?? throw new UnauthorizedException();

        if (newCredentials.Username is not null)
        {
            await _accountService.UpdateUsername(user.UserId, newCredentials.Username);
        }

        if (newCredentials.NewPassword is not null)
        {
            if (newCredentials.OldPassword is null)
            {
                throw new UnauthorizedException("The previous password is misssing from the request");
            }

            string oldPasswordHashInRequest = AccountsService.HashPassword(newCredentials.OldPassword);
            var userInfo = _accountService.GetInfo(user.UserId) ?? throw new NotFoundException("Not Found", "User info not found");
            string oldPasswordHashStored = userInfo.PasswordHash;
            if (!oldPasswordHashInRequest.Equals(oldPasswordHashStored, StringComparison.Ordinal))
            {
                throw new UnauthorizedException("The given old password does not match the stored old password");
            }

            await _accountService.UpdatePassword(user.UserId, newCredentials.NewPassword);
        }

        if (newCredentials.NewEmail is not null)
        {
            await _accountService.UpdateEmail(user.UserId, newCredentials.NewEmail);
        }

        return Ok();
    }

    // Confirm account
    [HttpPost]
    [Route("confirm/{token}")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmAccount(string token, [FromQuery] string? email = null)
    {
        var authInfo = await _accountService.ConfirmAccount(token);

        // If authInfo is null, then the token is bad
        if (authInfo is null)
        {
            // If token is bad and, but email is present then user is trying to resend the email
            if (email is not null)
            {
                await _accountService.ResendConfirmationEmail(email);
                return Ok();
            }

            return UnprocessableEntity("The token is invalid or expired.");
        }

        // Account is confirmed
        return Ok(authInfo);
    }
}
