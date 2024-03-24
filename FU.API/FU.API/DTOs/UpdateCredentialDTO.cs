namespace FU.API.Models;

using FU.API.Validation;
using System.ComponentModel.DataAnnotations;

public record UpdateCredentailsDTO
{
    [NonEmptyString]
    [StringLength(20, ErrorMessage = "Username can't be longer than 20 chracters")]
    public string? Username { get; set; }

    public string? NewPassword { get; set; }

    public string? OldPassword { get; set; }

    public string? NewEmail { get; set; }
}
