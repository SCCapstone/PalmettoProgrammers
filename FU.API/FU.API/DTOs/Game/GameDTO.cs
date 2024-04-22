namespace FU.API.DTOs.Game;

using FU.API.Validation;
using System.ComponentModel.DataAnnotations;

/// <summary>
/// The DTO for creating/retrieving games.
/// Name is the name of the game.
/// </summary>
public class GameDTO
{
    public int Id { get; set; }

    [NonEmptyString]
    [StringLength(80, ErrorMessage = "Game name can't be longer than 80 chracters")]
    public string Name { get; set; } = string.Empty;

    [UrlAttribute]
    public string? ImageUrl { get; set; }
}
