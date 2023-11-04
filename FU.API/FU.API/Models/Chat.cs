namespace FU.API.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public string? ChatName { get; set; }
        public ChatType ChatType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Message? LastMessage { get; set; }
        public int? LastMessageId { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public ApplicationUser? Creator { get; set; }
        public string? CreatorId { get; set; }
        public ICollection<ChatMembership> Members { get; set; }
        public ICollection<Message> Messages { get; set; }
    }

    public class ChatMembership
    {
        public int Id { get; set; }
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public Chat Chat { get; set; }
        public int ChatId { get; set; }
    }

    public class Message
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Content { get; set; }
        public ApplicationUser Sender { get; set; }
        public string SenderId { get; set; }
        public Chat Chat { get; set; }
        public int ChatId { get; set; }
    }

    public enum ChatType
    {
        Direct,
        Group
    }
}
