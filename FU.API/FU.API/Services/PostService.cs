namespace FU.API.Services;

using System.Net;
using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class PostService : CommonService, IPostService
{
    private readonly AppDbContext _dbContext;
    private readonly IChatService _chatService;

    public PostService(AppDbContext dbContext, IChatService chatService)
        : base(dbContext)
    {
        _dbContext = dbContext;
        _chatService = chatService;
    }

    public async Task<Post> CreatePost(Post post)
    {
        var game = await _dbContext.Games
            .FindAsync(post.GameId) ?? throw new NonexistentGameException();

        var user = await _dbContext.Users
            .FindAsync(post.CreatorId) ?? throw new NotFoundException("Creator not found", "The creator was not found");

        post.Game = game;

        // Check if either start time or end time is present when the other is present
        bool isInvalidTimeRange = (post.StartTime is null) != (post.EndTime is null);
        if (isInvalidTimeRange)
        {
            throw new PostException("Start and end times must both be present", HttpStatusCode.UnprocessableEntity);
        }

        // Make sure the post is not in the past
        bool isPostInPast = post.StartTime < DateTime.UtcNow;
        if (isPostInPast)
        {
            throw new PostException("Post cannot be in the past", HttpStatusCode.UnprocessableEntity);
        }

        // Make sure the post is not too far in the future
        bool isPostTooFarInFuture = post.StartTime > DateTime.UtcNow.AddYears(1);
        if (isPostTooFarInFuture)
        {
            throw new PostException("Post cannot be more than 1 year in the future", HttpStatusCode.UnprocessableEntity);
        }

        // Check if start time is after end time
        bool isStartTimeAfterEndTime = (post.StartTime is not null) && (post.EndTime is not null) && (post.StartTime > post.EndTime);
        if (isStartTimeAfterEndTime)
        {
            throw new PostException("Start time cannot be after end time", HttpStatusCode.UnprocessableEntity);
        }

        // Find how long the post will last
        if (post.StartTime is not null && post.EndTime is not null)
        {
            var duration = post.EndTime - post.StartTime;
            if (duration.Value.TotalMinutes < 5)
            {
                throw new PostException("Post must last at least 5 minutes", HttpStatusCode.UnprocessableEntity);
            }

            if (duration.Value.TotalHours > 24)
            {
                throw new PostException("Post must last at most 24 hours", HttpStatusCode.UnprocessableEntity);
            }
        }

        var postTagIds = post.Tags.Select(t => t.TagId);
        var tags = await _dbContext.Tags
            .Where(t => postTagIds.Contains(t.Id))
            .ToListAsync();

        // Put tags back into post
        post.Tags.Clear();
        foreach (var tag in tags)
        {
            post.Tags.Add(new TagRelation
            {
                Tag = tag,
            });
        }

        var chat = await _chatService.CreateChat(post.Creator, ChatType.Post, post.Title);

        post.Chat = chat;

        try
        {
            _dbContext.Posts.Add(post);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }

        return post;
    }

    public async Task<Post> UpdatePost(Post post)
    {
        Post postEntity = _dbContext.Posts.Find(post.Id) ?? throw new PostNotFoundException();

        if (postEntity.CreatorId != post.CreatorId)
        {
            throw new PostException("The updated post's user does not match the old post's user", HttpStatusCode.UnprocessableEntity);
        }

        var game = await _dbContext.Games
            .FindAsync(post.GameId) ?? throw new NonexistentGameException();
        postEntity.Game = game;
        postEntity.Description = post.Description;
        postEntity.MaxPlayers = post.MaxPlayers;
        postEntity.StartTime = post.StartTime;
        postEntity.EndTime = post.EndTime;
        postEntity.Title = post.Title;

        var postTagIds = post.Tags.Select(t => t.TagId);
        var tags = await _dbContext.Tags
            .Where(t => postTagIds.Contains(t.Id))
            .ToListAsync();

        // Update post tags
        postEntity.Tags.Clear();
        foreach (var tag in tags)
        {
            postEntity.Tags.Add(new TagRelation { Tag = tag });
        }

        _dbContext.Posts.Update(postEntity);
        await _dbContext.SaveChangesAsync();

        return postEntity;
    }

    public async Task<Post?> GetPost(int postId)
    {
        return await _dbContext.Posts
            .Where(p => p.Id == postId)
            .Include(p => p.Creator)
            .Include(p => p.Tags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Game)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<ApplicationUser>> GetPostUsers(int postId)
    {
        return await _dbContext.Posts
            .Where(p => p.Id == postId)
            .Include(p => p.Chat)
            .ThenInclude(c => c.Members)
            .ThenInclude(cm => cm.User)
            .SelectMany(p => p.Chat.Members)
            .Select(cm => cm.User)
            .ToListAsync();
    }

    public async Task JoinPost(int postId, ApplicationUser user)
    {
        var post = await _dbContext.Posts
            .Where(p => p.Id == postId)
            .Include(p => p.Chat)
            .ThenInclude(c => c.Members)
            .FirstOrDefaultAsync() ?? throw new PostNotFoundException();
        var chat = post.Chat;
        var userId = user.UserId;

        // Check that the post is not full
        if (post.MaxPlayers <= chat.Members.Count)
        {
            throw new PostException("Post is full", HttpStatusCode.Conflict);
        }

        // Check that the user is not already in the chat
        if (chat.Members.Any(m => m.UserId == userId))
        {
            throw new ConflictException("User is already in the post");
        }

        // Make the new chat member relation
        var chatMember = new ChatMembership
        {
            Chat = chat,
            User = user,
        };

        try
        {
            chat.Members.Add(chatMember);
            _dbContext.Update(chat);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }

        return;
    }

    public async Task LeavePost(int postId, ApplicationUser user)
    {
        // Find the chat membership
        var post = await _dbContext.Posts
            .Where(p => p.Id == postId)
            .FirstOrDefaultAsync() ?? throw new PostNotFoundException();
        var chatId = post.ChatId;
        var userId = user.UserId;
        var toRemove = await _dbContext.ChatMemberships
            .Where(cm => cm.ChatId == chatId && cm.UserId == userId)
            .FirstOrDefaultAsync() ?? throw new PostException("User is not in the post", HttpStatusCode.Forbidden);

        try
        {
            _dbContext.ChatMemberships.Remove(toRemove);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }

        return;
    }

    public async Task DeletePost(int postId)
    {
        // Find everything associated with a post
        var post = _dbContext.Posts.Find(postId) ?? throw new PostNotFoundException();
        var postMessages = _dbContext.Messages.Where(m => m.ChatId == post.ChatId).ToList();
        var chatMemberships = _dbContext.ChatMemberships.Where(cm => cm.ChatId == post.ChatId).ToList();
        var chat = _dbContext.Chats.Find(post.ChatId);

        // Delete everything found
        if (chat is not null)
        {
            // Break dependency on last message to allow for deletion
            chat.LastMessageId = null;
            _dbContext.Chats.Update(chat);
            await _dbContext.SaveChangesAsync();

            // Delete Chat
            _dbContext.Chats.Remove(chat);
        }

        _dbContext.Posts.Remove(post);
        _dbContext.Messages.RemoveRange(postMessages);
        _dbContext.ChatMemberships.RemoveRange(chatMemberships);

        await _dbContext.SaveChangesAsync();
    }
}
