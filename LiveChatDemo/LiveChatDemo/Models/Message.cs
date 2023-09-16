namespace LiveChatDemo.Models
{
    public class Message
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Content { get; set; }

        // Navigation Properties
        public int ChatId { get; set; }
        public Chat Chat { get; set; }
        public string SenderId { get; set; }
        public ApplicationUser Sender { get; set; }
    }
}
