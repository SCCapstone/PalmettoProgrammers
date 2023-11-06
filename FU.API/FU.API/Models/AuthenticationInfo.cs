namespace FU.API.Models;

public record AuthenticationInfo
{
    public AuthenticationInfo(string token, DateTime expiresAt)
    {
        Token = token;
        ExpiresAt = expiresAt;
    }

    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}