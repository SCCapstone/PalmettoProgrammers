namespace FU.API.Services;

using System.Net;
using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;

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
}
