namespace FU.API.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public Game Game { get; set; }
        public int GameId { get; set; }
        public string? Description { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? MaxPlayers { get; set; }
        public Chat Chat { get; set; }
        public int ChatId { get; set; }
        public ApplicationUser Creator { get; set; }
        public string CreatorId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<TagRelation> Tags { get; set; }
    }
}
