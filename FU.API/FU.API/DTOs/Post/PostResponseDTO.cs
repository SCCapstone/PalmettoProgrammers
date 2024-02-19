namespace FU.API.DTOs.Post;

using FU.API.Models;

public class PostResponseDTO
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Game { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? MaxPlayers { get; set; }

    public int ChatId { get; set; }

    public UserProfile Creator { get; set; } = new UserProfile();

    public ICollection<string> Tags { get; set; } = new HashSet<string>();

    public bool HasJoined { get; set; } = false;
}
