namespace FU.API.DTOs;

using FU.API.Validation;

public record AccountInfoDTO
{
    public int UserId { get; set; }

    [NonEmptyString]
    public string Username { get; set; } = string.Empty;
}
