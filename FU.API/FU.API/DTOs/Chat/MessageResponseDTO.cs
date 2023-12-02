namespace FU.API.DTOs.Chat;

public class MessageResponseDTO
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Content { get; set; } = string.Empty;

    public int SenderId { get; set; }

    public string SenderName { get; set; } = string.Empty;
}
