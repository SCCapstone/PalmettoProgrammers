namespace FU.API.Services;

using FU.API.Data;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;

public class ChatService : CommonService, IChatService
{
    private readonly AppDbContext _dbContext;

    public ChatService(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Chat?> CreateChat(ApplicationUser user1, ApplicationUser user2)
    {
        if (user1.UserId == user2.UserId || user1 is null || user2 is null)
        {
            return null;
        }

        var chat = new Chat
        {
            ChatType = ChatType.Direct,
            Creator = user1,
        };

        var membership1 = new ChatMembership
        {
            Chat = chat,
            User = user1,
        };

        var membership2 = new ChatMembership
        {
            Chat = chat,
            User = user2,
        };

        chat.Members.Add(membership1);
        chat.Members.Add(membership2);

        _dbContext.Chats.Add(chat);
        await _dbContext.SaveChangesAsync();

        return chat;
    }

    public async Task<Chat> CreateChat(ApplicationUser user, ChatType chatType, string chatName)
    {
        var chat = new Chat
        {
            ChatType = chatType,
            Creator = user,
            ChatName = chatName,
        };

        var membership = new ChatMembership
        {
            Chat = chat,
            User = user,
        };

        chat.Members.Add(membership);

        try
        {
            _dbContext.Chats.Add(chat);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }

        return chat;
    }

    public async Task<Chat?> GetChat(int chatId)
    {
        var chat = await _dbContext.Chats
            .Where(c => c.Id == chatId)
            .Include(c => c.Members).ThenInclude(m => m.User)
            .Include(c => c.LastMessage)
            .FirstOrDefaultAsync();
        return chat;
    }

    public async Task<Chat?> GetChat(int user1Id, int user2Id)
    {
        var chat = await _dbContext.Chats
            .Where(c => c.ChatType == ChatType.Direct)
            .Where(c => c.Members.Any(m => m.UserId == user1Id))
            .Where(c => c.Members.Any(m => m.UserId == user2Id))
            .Include(c => c.Members).ThenInclude(m => m.User)
            .Include(c => c.LastMessage)
            .FirstOrDefaultAsync();
        return chat;
    }

    public async Task<IEnumerable<Message>?> GetChatMessages(int chatId, int offset = 1, int limit = 10)
    {
        var messages = await _dbContext.Chats
            .Where(c => c.Id == chatId)
            .SelectMany(c => c.Messages)
            .OrderByDescending(m => m.CreatedAt)
            .Include(m => m.Sender)
            .Skip((offset - 1) * limit)
            .Take(limit)
            .Reverse()
            .ToListAsync();
        return messages;
    }

    public async Task<Message?> SaveMessage(Chat chat, string message, ApplicationUser user)
    {
        // Create the message
        var newMessage = new Message
        {
            Chat = chat,
            Content = message,
            Sender = user,
        };

        // Update the chat
        chat.LastMessage = newMessage;
        chat.LastMessageAt = DateTime.UtcNow;

        _dbContext.Messages.Add(newMessage);
        await _dbContext.SaveChangesAsync();
        return newMessage;
    }
}
