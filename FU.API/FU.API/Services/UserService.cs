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

    public async Task<UserProfile?> GetUserProfile(int userId)
    {
        var appUser = await _dbContext.Users.FindAsync(userId);

        return appUser?.ToProfile();
    }

    public async Task<UserProfile?> UpdateUserProfile(UserProfile profileChanges)
    {
        var user = await _dbContext.Users.FindAsync(profileChanges.Id);
        if (user is null)
        {
            return null;
        }

        if (profileChanges.IsOnline is not null)
        {
            user.IsOnline = profileChanges.IsOnline.Value;
        }

        if (profileChanges.PfpUrl is not null)
        {
            user.PfpUrl = profileChanges.PfpUrl;
        }

        if (profileChanges.Bio is not null)
        {
            user.Bio = profileChanges.Bio;
        }

        // Allows a user to clear DOB if they desire
        user.DOB = profileChanges.DOB;

        _dbContext.Update(user);
        _dbContext.SaveChanges();

        return user.ToProfile();
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
