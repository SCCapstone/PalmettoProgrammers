namespace FU.API.Models;

public record Credentials
{
    /// <summary>
    /// Gets or sets the user's username.
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's password.
    /// </summary>
    public string Password { get; set; } = string.Empty;
}