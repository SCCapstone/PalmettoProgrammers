namespace FU.API.Models;

public record UpdateCredentailsDTO
{
    public string? Username { get; set; }

    public string? NewPassword { get; set; }

    public string? OldPassword { get; set; }
}
