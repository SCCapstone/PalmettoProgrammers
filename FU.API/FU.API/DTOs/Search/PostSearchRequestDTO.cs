namespace FU.API.DTOs.Search;

using Microsoft.AspNetCore.Mvc;

public record PostSearchRequestDTO
{
    [FromQuery]
    public string? Tags { get; set; }

    [FromQuery]
    public string? Games { get; set; }

    [FromQuery]
    public DateOnly? StartOnOrAfterDate { get; set; }

    [FromQuery]
    public DateOnly? EndOnOrBeforeDate { get; set; }

    [FromQuery]
    public TimeOnly? StartOnOrAfterTime { get; set; }

    [FromQuery]
    public TimeOnly? EndOnOrBeforeTime { get; set; }

    [FromQuery]
    public string? Keywords { get; set; }

    [FromQuery]
    public string? Sort { get; set; }

    [FromQuery]
    public int? Limit { get; set; }

    [FromQuery]
    public int? Page { get; set; }

    [FromQuery]
    public int? MinPlayers { get; set; }
}
