namespace FU.API.Models
{
    /// <summary>
    /// The message class.
    /// </summary>
    public class Message
    {
        /// <summary>
        /// Gets or sets the id of the message.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets when the chat was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Gets or sets the content of the message.
        /// </summary>
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the sender of the message.
        /// </summary>
        public ApplicationUser Sender { get; set; } = new ApplicationUser();

        /// <summary>
        /// Gets or sets the id of the sender.
        /// </summary>
        public int SenderId { get; set; }

        /// <summary>
        /// Gets or sets the chat the message belongs to.
        /// </summary>
        public Chat Chat { get; set; } = new Chat();

        /// <summary>
        /// Gets or sets the chat id.
        /// </summary>
        public int ChatId { get; set; }
    }
}
