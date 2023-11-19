namespace FU.API.DTOs.Search;

using Microsoft.AspNetCore.Mvc;

public record PostSearchRequestDTO
{
    [FromQuery]
    public string Tags { get; set; } = string.Empty;

    [FromQuery]
    public string Games { get; set; } = string.Empty;

    [FromQuery]
    public DateTime? After { get; set; } = null;

    [FromQuery]
    public string Keywords { get; set; } = string.Empty;

    [FromQuery]
    public string Sort { get; set; } = string.Empty;

    [FromQuery]
    public int Limit { get; set; } = 20;

    [FromQuery]
    public int Offset { get; set; } = 0;

    [FromQuery]
    public int MinPlayers { get; set; } = 0;
}