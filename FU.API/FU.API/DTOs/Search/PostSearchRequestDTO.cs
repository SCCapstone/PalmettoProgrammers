namespace FU.API.DTOs.Search;

using Microsoft.AspNetCore.Mvc;

public record PostSearchRequestDTO
{
    [FromQuery]
    public string? Tags { get; set; }

    [FromQuery]
    public string? Games { get; set; }

    [FromQuery]
    public DateOnly? StartAfterDate { get; set; }

    [FromQuery]
    public DateOnly? EndBeforeDate { get; set; }

    [FromQuery]
    public TimeOnly? StartAfterTime { get; set; }

    [FromQuery]
    public TimeOnly? EndBeforeTime { get; set; }

    [FromQuery]
    public string? Keywords { get; set; }

    [FromQuery]
    public string? Sort { get; set; }

    [FromQuery]
    public int? Limit { get; set; }

    [FromQuery]
    public int? Offset { get; set; }

    [FromQuery]
    public int? MinPlayers { get; set; }
}
