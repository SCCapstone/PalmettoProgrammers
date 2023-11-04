namespace FU.API.DTOs;

public record LoginRequestDTO
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public record LoginResponseDTO
{
    public string Token { get; set; } = string.Empty;
}
