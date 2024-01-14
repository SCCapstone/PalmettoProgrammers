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

    public async Task<IEnumerable<ApplicationUser>> GetUsersPlayers(int userId, int limit, int offset)
    {
        var players = await _dbContext.UserRelations
            .Where(ur => ur.User1Id == userId || ur.User2Id == userId)
            .Select(ur => ur.User1Id == userId ? ur.User2 : ur.User1)
            .ToListAsync();

        // Also get users that have sent a direct message to the user
        var directMessages = await _dbContext.Chats
            .Where(c => c.ChatType == ChatType.Direct)
            .Where(c => c.Members.Any(m => m.UserId == userId))
            .SelectMany(c => c.Members)
            .Where(m => m.UserId != userId)
            .Select(m => m.User)
            .ToListAsync();

        var allPlayers = players.Union(directMessages);

        return allPlayers
            .Skip(offset)
            .Take(limit);
    }

    public async Task<ApplicationUser?> GetUserByName(string username)
    {
        return await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<ApplicationUser?> GetUserById(int userId)
    {
        return await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserId == userId);
    }

    public Task<bool> AreFriends(int user1Id, int user2Id)
    {
        return _dbContext.UserRelations
            .AnyAsync(ur => (ur.User1Id == user1Id && ur.User2Id == user2Id) || (ur.User1Id == user2Id && ur.User2Id == user1Id));
    }
}