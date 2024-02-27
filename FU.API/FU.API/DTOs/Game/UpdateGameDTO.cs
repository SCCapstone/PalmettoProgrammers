namespace FU.API.DTOs.Game;

using System.ComponentModel.DataAnnotations;

public class UpdateGameDTO
{
    [StringLength(80, ErrorMessage = "Game name can't be longer than 80 chracters")]
    public string? Name { get; set; }

    public string? ImageUrl { get; set; }
}
