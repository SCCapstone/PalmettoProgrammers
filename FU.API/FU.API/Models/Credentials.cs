using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace FU.API.Models;

[Index(nameof(Username))]
public record UserCredentials
{
    [Key]
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}

public record Credentials
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}