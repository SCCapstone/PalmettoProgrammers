namespace FU.API.Models;

public record AccountInfo
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
}