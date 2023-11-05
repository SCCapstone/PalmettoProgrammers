namespace FU.API.Models
{
    /// <summary>
    /// The group membership relation.
    /// </summary>
    public class GroupMembership
    {
        /// <summary>
        /// Gets or sets the id of the group membership.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the user of the relation.
        /// </summary>
        public ApplicationUser User { get; set; } = new ApplicationUser();

        /// <summary>
        /// Gets or sets the user id of the relation.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the group of the relation.
        /// </summary>
        public Group Group { get; set; } = new Group();

        /// <summary>
        /// Gets or sets the group id of the relation.
        /// </summary>
        public int GroupId { get; set; }

        /// <summary>
        /// Gets or sets the users role in the group.
        /// </summary>
        public GroupRole Role { get; set; }
    }

    /// <summary>
    /// The group role enum.
    /// </summary>
    public enum GroupRole
    {
        /// <summary>
        /// Leader of the group.
        /// </summary>
        Leader,

        /// <summary>
        /// Moderator of the group.
        /// </summary>
        Moderator,

        /// <summary>
        /// Member of the group.
        /// </summary>
        Member
    }
}
