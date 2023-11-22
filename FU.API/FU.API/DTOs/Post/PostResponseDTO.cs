namespace FU.API.DTOs.Post
{
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

        public string Creator { get; set; } = string.Empty;

        public ICollection<string> Tags { get; set; } = new HashSet<string>();
    }
}
