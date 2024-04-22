namespace FU.API.DTOs.Tag;

using System.ComponentModel.DataAnnotations;
using FU.API.Validation;

/// <summary>
/// The DTO for creating tags.
/// Tag names can't be longer than 20 characters.
/// </summary>
public class TagRequestDTO
{
    [NoSpaces]
    [Lowercase]
    [NonEmptyString]
    [StringLength(20, ErrorMessage = "Tags can't be longer than 20 chracters")]
    public string Name { get; set; } = string.Empty;
}
