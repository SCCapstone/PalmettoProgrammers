namespace FU.API.Services;

using FU.API.Data;
using FU.API.Models;
using FU.API.Helpers;

public class UserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<UserProfile?> GetUserProfile(int userId)
    {
        UserProfile? profile = _dbContext.Users.Find(userId)?.ToProfile();

        return Task.FromResult(profile);
    }
}