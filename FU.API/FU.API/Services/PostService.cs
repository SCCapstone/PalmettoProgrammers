namespace FU.API.Services;

using FU.API.Data;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class PostService : IPostService
{
    private readonly AppDbContext _dbContext;
    private readonly IChatService _chatService;

    public PostService(AppDbContext dbContext, IChatService chatService)
    {
        _dbContext = dbContext;
        _chatService = chatService;
    }

    public async Task<Post?> CreatePost(Post post)
    {
        var game = await _dbContext.Games
            .FindAsync(post.GameId);

        if (game is null)
        {
            return null;
        }

        post.Game = game;

        var postTagIds = post.Tags.Select(t => t.TagId);
        var tags = await _dbContext.Tags
            .Where(t => postTagIds.Contains(t.Id))
            .ToListAsync();

        if (tags.Count != postTagIds.Count())
        {
            return null;
        }

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

        if (chat is null)
        {
            return null;
        }

        post.Chat = chat;

        _dbContext.Posts.Add(post);
        await _dbContext.SaveChangesAsync();

        return post;
    }

    public async Task<Post?> GetPost(int postId)
    {
        var post = await _dbContext.Posts
            .Where(p => p.Id == postId)
            .Include(p => p.Creator)
            .Include(p => p.Tags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Game)
            .FirstOrDefaultAsync();
        return post;
    }

    public async Task<IEnumerable<Post>?> GetPosts()
    {
        var posts = await _dbContext.Posts
            .Include(p => p.Creator)
            .Include(p => p.Tags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Game)
            .ToListAsync();
        return posts;
    }
}