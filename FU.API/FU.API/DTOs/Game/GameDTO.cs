namespace FU.API.DTOs.Game;

using System.ComponentModel.DataAnnotations;

public class GameDTO
{
    public int Id { get; set; }

    [StringLength(80, ErrorMessage = "Game name can't be longer than 80 chracters")]
    public string Name { get; set; } = string.Empty;

    [UrlAttribute]
    public string? ImageUrl { get; set; }
}
