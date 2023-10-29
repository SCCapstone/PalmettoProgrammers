namespace ForcesUnite.Models;

// TODO use hashed password
public record Credentials
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}