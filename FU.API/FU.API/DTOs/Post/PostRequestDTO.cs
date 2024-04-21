namespace FU.API.DTOs.Post;

using FU.API.Validation;
using System.ComponentModel.DataAnnotations;

/// <summary>
/// The DTO for creating posts.
/// Needs a title and a gameId.
/// TagIds is a list of tag ids.
/// </summary>
public class PostRequestDTO
{
    [NonEmptyString]
    [StringLength(60, ErrorMessage = "Title can't be longer than 60 chracters")]
    public string Title { get; set; } = string.Empty;

    public int GameId { get; set; }

    [StringLength(1500, ErrorMessage = "Description can't be longer than 1500 chracters")]
    public string? Description { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? MaxPlayers { get; set; }

    public ICollection<int>? TagIds { get; set; } = new HashSet<int>();
}
