namespace FU.API.Services;

using System.Net;
using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Microsoft.Extensions.Hosting;

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
        if (await _dbContext.Users.FindAsync(post.CreatorId) is null)
        {
            throw new NotFoundException("Creator not found", "The creator was not found");
        }

        if (post.Creator is null)
        {
            throw new PostException("Creator is null", HttpStatusCode.UnprocessableEntity);
        }

        post.Game = await _dbContext.Games.FindAsync(post.GameId)
            ?? throw new NonexistentGameException();

        AssertValidDateAndTime(post);

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

        post.Chat = await _chatService.CreateChat(post.Creator, ChatType.Post, post.Title);

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

    public async Task<Post> UpdatePost(Post postChanges)
    {
        Post ogPost = _dbContext.Posts.Find(postChanges.Id) ?? throw new PostNotFoundException();

        if (ogPost.CreatorId != postChanges.CreatorId)
        {
            throw new PostException("The updated post's creator does not match the old post's creator", HttpStatusCode.UnprocessableEntity);
        }

        AssertValidDateAndTime(postChanges, updatingPost: true);

        ogPost.Game = await _dbContext.Games.FindAsync(postChanges.GameId) ?? throw new NonexistentGameException();
        ogPost.Description = postChanges.Description;
        ogPost.MaxPlayers = postChanges.MaxPlayers;
        ogPost.StartTime = postChanges.StartTime;
        ogPost.EndTime = postChanges.EndTime;
        ogPost.Title = postChanges.Title;

        var newTagIds = postChanges.Tags.Select(t => t.TagId);
        var newTags = await _dbContext.Tags
            .Where(t => newTagIds.Contains(t.Id))
            .ToListAsync();

        // Update post tags
        ogPost.Tags.Clear();
        foreach (var tag in newTags)
        {
            ogPost.Tags.Add(new TagRelation { Tag = tag });
        }

        _dbContext.Posts.Update(ogPost);
        await _dbContext.SaveChangesAsync();

        return ogPost;
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

        // Check that the post is not full
        if (post.MaxPlayers <= post.Chat.Members.Count)
        {
            throw new PostException("Post is full", HttpStatusCode.Conflict);
        }

        // Check that the user is not already in the chat
        if (post.Chat.Members.Any(m => m.UserId == user.UserId))
        {
            throw new ConflictException("User is already in the post");
        }

        // Add user to post members
        post.Chat.Members.Add(new ChatMembership
        {
            Chat = post.Chat,
            User = user,
        });

        _dbContext.Update(post.Chat);

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }
    }

    public async Task LeavePost(int postId, ApplicationUser user)
    {
        // Find the chat membership
        var post = await _dbContext.Posts
            .Where(p => p.Id == postId)
            .FirstOrDefaultAsync() ?? throw new PostNotFoundException();
        var postMembership = await _dbContext.ChatMemberships
            .Where(cm => cm.ChatId == post.ChatId && cm.UserId == user.UserId)
            .FirstOrDefaultAsync() ?? throw new PostException("User is not in the post", HttpStatusCode.Forbidden);

        _dbContext.ChatMemberships.Remove(postMembership);

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }
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

    private static void AssertValidDateAndTime(Post post, bool updatingPost = false)
    {
        // Check if either start time or end time is present when the other is present
        bool isInvalidTimeRange = (post.StartTime is null) != (post.EndTime is null);
        if (isInvalidTimeRange)
        {
            throw new PostException("Start and end times must both be present", HttpStatusCode.UnprocessableEntity);
        }

        // Make sure the post is not in the past
        // Only check if we are not updating the post so that we can allow for posts to be updated
        bool isPostInPast = post.StartTime < DateTime.UtcNow;
        if (!updatingPost && isPostInPast)
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
    }
}
