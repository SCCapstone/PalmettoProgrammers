﻿namespace FU.API.Services;

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

    public async Task<ApplicationUser?> GetAuthorizedUser(ClaimsPrincipal claims, bool mustBeConfirmed = true)
    {
        var stringId = claims.FindFirstValue(CustomClaimTypes.UserId);

        if (stringId is null || !int.TryParse(stringId, out int userId))
        {
            return null;
        }

        // Get the user from the database
        var user = await _dbContext.Users.FindAsync(userId);

        // If the user is not confirmed and it must be, throw an unauthorized exception
        if (mustBeConfirmed && user is not null && !user.AccountConfirmed)
        {
            throw new UnauthorizedException("Account not confirmed");
        }

        return user;
    }

    public async Task<ApplicationUser?> GetUser(int userId)
    {
        return await _dbContext.Users.FindAsync(userId);
    }

    public async Task<ApplicationUser?> GetUser(string username)
    {
        return await _dbContext.Users.Where(u => u.NormalizedUsername == username.ToUpper()).FirstOrDefaultAsync();
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

    public async Task<UserRelation?> GetRelation(int initiatedById, int otherUserId)
    {
        if (initiatedById == otherUserId)
        {
            throw new BadRequestException("You can't get your own relation");
        }

        await AssertUserExists(initiatedById);
        await AssertUserExists(otherUserId);

        var relation = await _dbContext.UserRelations
            .Where(r => r.User1Id == initiatedById && r.User2Id == otherUserId)
            .FirstOrDefaultAsync();

        return relation;
    }

    private async Task AssertUserExists(int userId)
    {
        if (await _dbContext.Users.FindAsync(userId) is null)
        {
            throw new NotFoundException("User not found", "The requested user was not found");
        }
    }
}
