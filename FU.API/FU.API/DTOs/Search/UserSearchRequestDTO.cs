namespace FU.API.DTOs.Search;

using Microsoft.AspNetCore.Mvc;

/// <summary>
/// The request DTO for searching for users.
/// All properties are optional.
/// Will be converted to a UserQuery.
/// </summary>
public record UserSearchRequestDTO
{
    [FromQuery]
    public string? Keywords { get; set; }

    [FromQuery]
    public string? Sort { get; set; }

    [FromQuery]
    public int? Limit { get; set; }

    [FromQuery]
    public int? Page { get; set; }
}
