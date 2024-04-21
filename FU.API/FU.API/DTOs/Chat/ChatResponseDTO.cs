namespace FU.API.DTOs.Chat;

/// <summary>
/// The response DTO for chat.
/// Members is a collection of usernames.
/// </summary>
public class ChatResponseDTO
{
    public int Id { get; set; }

    public string? ChatName { get; set; }

    public string? LastMessage { get; set; }

    public string ChatType { get; set; } = string.Empty;

    public ICollection<string> Members { get; set; } = new HashSet<string>();
}
