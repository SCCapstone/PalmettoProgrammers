namespace FU.API.Models
{
    /// <summary>
    /// The post class.
    /// </summary>
    public class Post
    {
        /// <summary>
        /// Gets or sets the id of the post.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the title of the post.
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the game of the post.
        /// </summary>
        public Game Game { get; set; } = new Game();

        /// <summary>
        /// Gets or sets the id of the game.
        /// </summary>
        public int GameId { get; set; }

        /// <summary>
        /// Gets or sets the description of the post.
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        public DateTime? StartTime { get; set; }

        /// <summary>
        /// Gets or sets the posts end time.
        /// </summary>
        public DateTime? EndTime { get; set; }

        /// <summary>
        /// Gets or sets the max players.
        /// </summary>
        public int? MaxPlayers { get; set; }

        /// <summary>
        /// Gets or sets the chat for the post.
        /// </summary>
        public Chat Chat { get; set; } = new Chat();

        /// <summary>
        /// Gets or sets the id of the chat.
        /// </summary>
        public int ChatId { get; set; }

        /// <summary>
        /// Gets or sets the creator of the post.
        /// </summary>
        public ApplicationUser Creator { get; set; } = new ApplicationUser();

        /// <summary>
        /// Gets or sets the id of the creator.
        /// </summary>
        public int CreatorId { get; set; }

        /// <summary>
        /// Gets or sets when the post was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Gets or sets the tags of a post.
        /// </summary>
        public ICollection<TagRelation> Tags { get; set; } = new HashSet<TagRelation>();
    }
}
