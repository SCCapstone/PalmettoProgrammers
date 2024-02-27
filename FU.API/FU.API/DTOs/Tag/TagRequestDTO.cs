namespace FU.API.DTOs.Tag;

using System.ComponentModel.DataAnnotations;
using FU.API.Validation;

public class TagRequestDTO
{
    [NoSpaces]
    [StringLength(20, ErrorMessage = "Tags can't be longer than 20 chracters")]
    public string Name { get; set; } = string.Empty;
}
