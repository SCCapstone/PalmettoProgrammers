﻿namespace FU.API.Models;

using FU.API.Validation;
using System.ComponentModel.DataAnnotations;

public record Credentials
{
    /// <summary>
    /// Gets or sets the user's username.
    /// </summary>
    [StringLength(20, ErrorMessage = "Username can't be longer than 20 chracters")]
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's password.
    /// </summary>
    public string Password { get; set; } = string.Empty;

    [Email]
    public string Email { get; set; } = string.Empty;

    public bool ReconfirmAccount { get; set; } = false;
}
