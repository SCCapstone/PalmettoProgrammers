namespace FU.API.Models;

public record UpdateCredentailsDTO
{
    public string? Username { get; set; }

    public string? Password { get; set; }
}
