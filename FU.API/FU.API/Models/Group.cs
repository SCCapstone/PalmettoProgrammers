namespace FU.API.Models
{
    public class Group
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ApplicationUser Creator { get; set; }
        public string CreatorId { get; set; }
        public Chat Chat { get; set; }
        public int ChatId { get; set; }
        public ICollection<GroupMembership> Memberships { get; set; }
    }

    public class GroupMembership
    {
        public int Id { get; set; }
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public Group Group { get; set; }
        public int GroupId { get; set; }
        public GroupRole Role { get; set; }
    }

    public enum GroupRole
    {
        Leader,
        Moderator,
        Member
    }
}
