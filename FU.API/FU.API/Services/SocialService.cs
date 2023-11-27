namespace FU.API.Services;

using FU.API.Data;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

public class SocialService : CommonService, ISocialService
{
    private readonly AppDbContext _appDbContext;

    public SocialService(AppDbContext appDbContext)
               : base(appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<IEnumerable<Post>> GetUsersAssociatedPosts(int userId, int limit, int offset)
    {
        return await _appDbContext.Posts
            .Where(p => p.Chat.Members.Any(m => m.User.UserId == userId))
            .Include(p => p.Creator)
            .Include(p => p.Game)
            .Include(p => p.Tags).ThenInclude(t => t.Tag)
            .Skip(offset * limit)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<Group>> GetUsersGroups(int userId, int limit, int offset)
    {
        return await _appDbContext.Groups
            .Where(g => g.Memberships.Any(m => m.User.UserId == userId))
            .Include(g => g.Creator)
            .Include(g => g.Memberships).ThenInclude(m => m.User)
            .Skip(offset * limit)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<ApplicationUser>> GetUsersPlayers(int userId, int limit, int offset)
    {
        var players = await _appDbContext.UserRelations
            .Where(ur => ur.User1Id == userId || ur.User2Id == userId)
            .Select(ur => ur.User1Id == userId ? ur.User2 : ur.User1)
            .ToListAsync();

        // Also get users that have sent a direct message to the user
        var directMessages = await _appDbContext.Chats
            .Where(c => c.ChatType == ChatType.Direct)
            .Where(c => c.Members.Any(m => m.UserId == userId))
            .SelectMany(c => c.Members)
            .Where(m => m.UserId != userId)
            .Select(m => m.User)
            .ToListAsync();

        var allPlayers = players.Union(directMessages);

        return allPlayers
            .Skip(offset * limit)
            .Take(limit);
    }
}
