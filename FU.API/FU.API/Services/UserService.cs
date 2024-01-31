namespace FU.API.Services;

using FU.API.Data;
using FU.API.Models;
using FU.API.Helpers;
using FU.API.Interfaces;
using Microsoft.EntityFrameworkCore;

public class UserService : CommonService, IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<UserProfile?> GetUserProfile(int userId)
    {
        UserProfile? profile = _dbContext.Users.Find(userId)?.ToProfile();

        return Task.FromResult(profile);
    }

    public Task<UserProfile?> UpdateUserProfile(UserProfile profileChanges)
    {
        var user = _dbContext.Users.Find(profileChanges.Id);
        if (user is null)
        {
            return Task.FromResult<UserProfile?>(null);
        }

        if (profileChanges.IsOnline is not null)
        {
            user.IsOnline = (bool)profileChanges.IsOnline;
        }

        if (profileChanges.PfpUrl is not null)
        {
            user.PfpUrl = profileChanges.PfpUrl;
        }

        if (profileChanges.Bio is not null)
        {
            user.Bio = profileChanges.Bio;
        }

        if (profileChanges.DOB is not null)
        {
            user.DOB = profileChanges.DOB;
        }

        _dbContext.Update(user);
        _dbContext.SaveChanges();

        return Task.FromResult<UserProfile?>(user.ToProfile());
    }

    public async Task<IEnumerable<Post>> GetUsersAssociatedPosts(int userId, int limit, int offset)
    {
        return await _dbContext.Posts
            .Where(p => p.Chat.Members.Any(m => m.User.UserId == userId))
            .Include(p => p.Creator)
            .Include(p => p.Game)
            .Include(p => p.Tags).ThenInclude(t => t.Tag)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<Group>> GetUsersGroups(int userId, int limit, int offset)
    {
        return await _dbContext.Groups
            .Where(g => g.Memberships.Any(m => m.User.UserId == userId))
            .Include(g => g.Creator)
            .Include(g => g.Memberships).ThenInclude(m => m.User)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }
}