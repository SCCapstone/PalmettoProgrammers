namespace FU.API.Models;

using FU.API.Helpers;

public record AccountInfoDTO
{
    public int UserId { get; set; }

    [NonEmptyString]
    public string Username { get; set; } = string.Empty;
}
