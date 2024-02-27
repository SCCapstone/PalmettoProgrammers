namespace FU.API.DTOs.Tag;

using System.ComponentModel.DataAnnotations;
using FU.API.Validation;
using FU.API.Helpers;

public class TagRequestDTO
{
    [NoSpaces]
    [Lowercase]
    [StringLength(20, ErrorMessage = "Tags can't be longer than 20 chracters")]
    public string Name { get; set; } = string.Empty;
}
