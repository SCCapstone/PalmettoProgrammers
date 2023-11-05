namespace FU.API.Models;

public record AccountInfo
{
    /// <summary>
    /// Gets or sets the userId.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Gets or sets the username.
    /// </summary>
    public string Username { get; set; } = string.Empty;
}