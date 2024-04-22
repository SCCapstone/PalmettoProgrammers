namespace FU.API.DTOs.Search;

using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Represents a request to search for posts.
/// All properties are optional.
/// Will be converted to a PostQuery.
/// </summary>
public record PostSearchRequestDTO
{
    [FromQuery]
    public string? Tags { get; set; }

    [FromQuery]
    public string? Games { get; set; }

    [FromQuery]
    public DateTime? StartOnOrAfterDateTime { get; set; }

    [FromQuery]
    public DateTime? EndOnOrBeforeDateTime { get; set; }

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
