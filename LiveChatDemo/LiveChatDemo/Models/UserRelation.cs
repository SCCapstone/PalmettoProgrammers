namespace LiveChatDemo.Models
{
    public class UserRelation
    {
        public int Id { get; set; }
        public RelationType Type { get; set; }

        // Navigation Properties
        public int EntityId { get; set; }
        public Entity Entity { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }

    public enum RelationType
    {
        Chat = 0,
        Group = 1,
        Friend = 2
    }
}
