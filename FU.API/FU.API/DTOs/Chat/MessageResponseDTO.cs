namespace FU.API.DTOs.Chat;

using FU.API.Models;

public class MessageResponseDTO
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Content { get; set; } = string.Empty;

    public UserProfile Sender { get; set; } = new UserProfile();
}
