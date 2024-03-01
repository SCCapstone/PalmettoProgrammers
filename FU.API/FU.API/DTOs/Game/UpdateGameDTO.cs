namespace FU.API.DTOs.Game;

using FU.API.Validation;
using System.ComponentModel.DataAnnotations;

public class UpdateGameDTO
{
    [NonEmptyString]
    [StringLength(80, ErrorMessage = "Game name can't be longer than 80 chracters")]
    public string? Name { get; set; }

    public string? ImageUrl { get; set; }
}
