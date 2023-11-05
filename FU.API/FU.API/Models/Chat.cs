namespace FU.API.Models
{
    /// <summary>
    /// The chat class.
    /// </summary>
    public class Chat
    {
        /// <summary>
        /// Gets or sets the id of the chat.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the chat.
        /// </summary>
        public string? ChatName { get; set; }

        /// <summary>
        /// Gets or sets the type of chat.
        /// </summary>
        public ChatType ChatType { get; set; }

        /// <summary>
        /// Gets or sets when the chat was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Gets or sets the last message sent.
        /// </summary>
        public Message? LastMessage { get; set; }

        /// <summary>
        /// Gets or sets the Id of the last message.
        /// </summary>
        public int? LastMessageId { get; set; }

        /// <summary>
        /// Gets or sets when the last message was sent.
        /// </summary>
        public DateTime? LastMessageAt { get; set; }

        /// <summary>
        /// Gets or sets the creator of the chat.
        /// </summary>
        public ApplicationUser? Creator { get; set; }

        /// <summary>
        /// Gets or sets the id of the creator of the chat.
        /// </summary>
        public int? CreatorId { get; set; }

        /// <summary>
        /// Gets or sets the members of the chat.
        /// </summary>
        public ICollection<ChatMembership> Members { get; set; } = new HashSet<ChatMembership>();

        /// <summary>
        /// Gets or sets the messages of the chat.
        /// </summary>
        public ICollection<Message> Messages { get; set; } = new HashSet<Message>();
    }

    /// <summary>
    /// The chat type enum.
    /// </summary>
    public enum ChatType
    {
        /// <summary>
        /// Chat between 2 users.
        /// </summary>
        Direct,

        /// <summary>
        /// Chat between multiple users.
        /// </summary>
        Group
    }
}
