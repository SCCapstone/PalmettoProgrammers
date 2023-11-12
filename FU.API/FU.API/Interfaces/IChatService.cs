namespace FU.API.Interfaces
{
    using FU.API.Models;

    public interface IChatService
    {
        Task<Chat?> GetChat(int chatId);

        Task<Chat?> GetChat(int user1Id, int user2Id);

        Task<Message?> SaveMessage(Chat chat, string message, ApplicationUser user);

        Task<IEnumerable<Message>?> GetChatMessages(int chatId, int offset = 1, int limit = 10);

        Task<Chat?> CreateChat(ApplicationUser user1, ApplicationUser user2);
    }
}
