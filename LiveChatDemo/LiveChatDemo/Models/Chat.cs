namespace LiveChatDemo.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public string? ChatName { get; set; }
        public ChatType Type { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        public int EntityId { get; set; }
        public Entity Entity { get; set; }
        public string CreatorId { get; set; }
        public ApplicationUser Creator { get; set; }
        public ICollection<Message> Messages { get; set; }
    }

    public enum ChatType
    {
        Direct = 0,
        Group = 1
    }
}
