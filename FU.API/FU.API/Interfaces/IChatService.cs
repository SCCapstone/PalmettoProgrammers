namespace FU.API.Interfaces;

using FU.API.Models;

/// <summary>
/// Interface for the chat service.
/// </summary>
public interface IChatService : ICommonService
{
    /// <summary>
    /// Gets a chat by its id.
    /// </summary>
    /// <param name="chatId">The chat id.</param>
    /// <returns>The chat model.</returns>
    Task<Chat?> GetChat(int chatId);

    /// <summary>
    /// Gets a chat between two users.
    /// </summary>
    /// <param name="user1Id">The first user id.</param>
    /// <param name="user2Id">The second user id.</param>
    /// <returns>The chat model.</returns>
    Task<Chat?> GetChat(int user1Id, int user2Id);

    /// <summary>
    /// Saves a message to a chat.
    /// </summary>
    /// <param name="chat">The chat to save the message to.</param>
    /// <param name="message">The message sent.</param>
    /// <param name="user">The user sending the message.</param>
    /// <returns>The newly created message model.</returns>
    Task<Message?> SaveMessage(Chat chat, string message, ApplicationUser user);

    /// <summary>
    /// Gets the messages in a chat.
    /// </summary>
    /// <param name="chatId">The id of the chat.</param>
    /// <param name="offset">The offset for pagnation.</param>
    /// <param name="limit">The limit for pagnation.</param>
    /// <returns>The messages of the chat, limited by limit.</returns>
    Task<IEnumerable<Message>?> GetChatMessages(int chatId, int offset = 1, int limit = 10);

    /// <summary>
    /// Creates a chat between two users.
    /// </summary>
    /// <param name="user1">The first user.</param>
    /// <param name="user2">The second user.</param>
    /// <returns>The newly created chat model.</returns>
    Task<Chat?> CreateChat(ApplicationUser user1, ApplicationUser user2);

    /// <summary>
    /// Creates a chat.
    /// </summary>
    /// <param name="user">The creator of the chat.</param>
    /// <param name="chatType">The chat type.</param>
    /// <param name="chatName">The chat name.</param>
    /// <returns>The newly created chat model.</returns>
    Task<Chat> CreateChat(ApplicationUser user, ChatType chatType, string chatName);
}
