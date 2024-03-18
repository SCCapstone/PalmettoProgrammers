namespace FU.API.Services;

using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public class CommonService : ICommonService
{
    private readonly AppDbContext _dbContext;

    public CommonService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserRelation?> GetRelation(int initiatedById, int otherUserId)
    {
        if (initiatedById == otherUserId)
        {
            throw new BadRequestException("You can't get your own relation");
        }

        // Make sure the users exist
        var initiatedByUser = await _dbContext.Users.FindAsync(initiatedById) ?? throw new NotFoundException("User not found", "The requested user was not found");
        var otherUser = await _dbContext.Users.FindAsync(otherUserId) ?? throw new NotFoundException("User not found", "The requested user was not found");

        var relation = await _dbContext.UserRelations.Where(r => r.User1Id == initiatedById && r.User2Id == otherUserId).FirstOrDefaultAsync();

        return relation;
    }

    public async Task<ApplicationUser?> GetCurrentUser(ClaimsPrincipal claims)
    {
        var stringId = claims.FindFirstValue(CustomClaimTypes.UserId);

        if (stringId is null || !int.TryParse(stringId, out int userId))
        {
            return null;
        }

        // Get the user from the database
        return await _dbContext.Users.FindAsync(userId);
    }

    public async Task<ApplicationUser?> GetUser(int userId)
    {
        return await _dbContext.Users.FindAsync(userId);
    }

    public async Task<bool> HasJoinedPost(int userId, int postId)
    {
        var chat = await _dbContext.Posts
            .Include(p => p.Chat)
            .ThenInclude(c => c.Members)
            .ThenInclude(cu => cu.User)
            .Where(p => p.Id == postId)
            .Select(p => p.Chat)
            .FirstOrDefaultAsync();

        var res = chat is not null && chat.Members.Any(m => m.UserId == userId);
        return res;
    }
}
