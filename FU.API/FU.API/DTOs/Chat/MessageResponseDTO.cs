namespace FU.API.DTOs.Chat;

using FU.API.Models;

/// <summary>
/// The response DTO for message.
/// Sender is the user who sent the message, and contains the username and avatar.
/// </summary>
public class MessageResponseDTO
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Content { get; set; } = string.Empty;

    public UserProfile Sender { get; set; } = new UserProfile();
}
