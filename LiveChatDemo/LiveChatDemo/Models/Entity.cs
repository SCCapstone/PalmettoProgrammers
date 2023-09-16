namespace LiveChatDemo.Models
{
    public class Entity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public EntityType Type { get; set; }
    }

    public enum EntityType
    {
        Chat = 0,
        Group = 1,
        User = 2
    }
}
