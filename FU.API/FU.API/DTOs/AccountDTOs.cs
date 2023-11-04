namespace FU.API.DTOs;

public record TokenResponseDTO
{
    public TokenResponseDTO(string token)
    {
        Token = token;
    }

    public string Token { get; set; } = string.Empty;
}