namespace FU.API.Models;

public record AccountInfoDTO
{
    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;
}
