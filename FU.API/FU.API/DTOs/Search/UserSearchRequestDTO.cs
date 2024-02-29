namespace FU.API.DTOs.Search;

using Microsoft.AspNetCore.Mvc;

public record UserSearchRequestDTO
{
    [FromQuery]
    public string? Keywords { get; set; }

    [FromQuery]
    public string? Sort { get; set; }

    [FromQuery]
    public int? Limit { get; set; }

    [FromQuery]
    public int? Offset { get; set; }
}
