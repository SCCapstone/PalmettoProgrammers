namespace FU.API.DTOs;

/// <summary>
/// The DTO for resending a confirmation email.
/// May be trying to find the user by email or username.
/// </summary>
public class ResendConfirmationDTO
{
    public string? Email { get; set; }

    public string? Username { get; set; }
}
