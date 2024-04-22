namespace FU.API.DTOs;

/// <summary>
/// The request DTO for login.
/// Used for logging in.
/// </summary>
public class LoginRequestDTO
{
    public string Username { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}
