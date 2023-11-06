namespace FU.API.Services;

using FU.API.Data;
using FU.API.Models;

public class PostService
{
    private readonly AppDbContext _dbContext;

    public PostService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Post?> CreatePost(Post post)
    {
        var newPost = _dbContext.Posts.Add(post);
        _dbContext.SaveChanges();

        return Task.FromResult<Post?>(newPost.Entity);
    }
}