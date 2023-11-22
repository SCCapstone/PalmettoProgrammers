namespace FU.API.DTOs.Post
{
    public class PostRequestDTO
    {
        public string Title { get; set; } = string.Empty;

        public int GameId { get; set; }

        public string? Description { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public int? MaxPlayers { get; set; }

        public ICollection<int>? TagIds { get; set; } = new HashSet<int>();
    }
}
