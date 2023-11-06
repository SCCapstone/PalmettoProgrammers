namespace FU.API.Models
{
    /// <summary>
    /// The chat membership relation.
    /// </summary>
    public class ChatMembership
    {
        /// <summary>
        /// Gets or sets the id of the chat membership.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the user.
        /// </summary>
        public ApplicationUser User { get; set; } = new ApplicationUser();

        /// <summary>
        /// Gets or sets the id of the user.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the chat of the relation.
        /// </summary>
        public Chat Chat { get; set; } = new Chat();

        /// <summary>
        /// Gets or sets the id of the chat.
        /// </summary>
        public int ChatId { get; set; }
    }
}
