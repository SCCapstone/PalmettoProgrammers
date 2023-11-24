namespace FU.API.Services;

using FU.API.Data;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

public class SocialService : CommonService, ISocialService
{
    private readonly AppDbContext _appDbContext;

    public SocialService(AppDbContext appDbContext)
               : base(appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<IEnumerable<Post>> GetUsersAssociatedPosts(int userId)
    {
        return await _appDbContext.Posts
            .Where(p => p.Chat.Members.Any(m => m.User.UserId == userId))
            .Include(p => p.Creator)
            .Include(p => p.Game)
            .Include(p => p.Tags).ThenInclude(t => t.Tag)
            .ToListAsync();
    }

    public async Task<IEnumerable<Group>> GetUsersGroups(int userId)
    {
        return await _appDbContext.Groups
            .Where(g => g.Memberships.Any(m => m.User.UserId == userId))
            .Include(g => g.Creator)
            .Include(g => g.Memberships).ThenInclude(m => m.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<ApplicationUser>> GetUsersPlayers(int userId)
    {
        var players = _appDbContext.UserRelations
            .Where(ur => ur.User1Id == userId || ur.User2Id == userId);

        if (status is not null)
        {
            players = players.Where(u => u.Status == status);
        }

        return await players
            .Select(ur => ur.User1Id == userId ? ur.User2 : ur.User1)
            .ToListAsync();
    }
}
