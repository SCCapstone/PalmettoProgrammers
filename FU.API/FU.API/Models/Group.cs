namespace FU.API.Models
{
    /// <summary>
    /// The group.
    /// </summary>
    public class Group
    {
        /// <summary>
        /// Gets or sets the id of the group.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the group.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the image url.
        /// </summary>
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets when the group was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Gets or sets the creator of the group.
        /// </summary>
        public ApplicationUser? Creator { get; set; }

        /// <summary>
        /// Gets or sets the id of the creator.
        /// </summary>
        public string? CreatorId { get; set; }

        /// <summary>
        /// Gets or sets the chat of the group.
        /// </summary>
        public Chat Chat { get; set; } = new Chat();

        /// <summary>
        /// Gets or sets the id of the groups chat.
        /// </summary>
        public int ChatId { get; set; }

        /// <summary>
        /// Gets or sets the members of the group.
        /// </summary>
        public ICollection<GroupMembership> Memberships { get; set; } = new HashSet<GroupMembership>();
    }
}
