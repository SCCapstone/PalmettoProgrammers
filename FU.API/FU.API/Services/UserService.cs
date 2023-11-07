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

    public Task<UserProfile?> UpdateUserProfile(UserProfile profileChanges)
    {
        var profile = _dbContext.Users.Find(profileChanges.Id);
        if (profile is null)
        {
            return Task.FromResult<UserProfile?>(null);
        }

        if (profileChanges.IsOnline is not null)
        {
            profile.IsOnline = (bool)profileChanges.IsOnline;
        }

        if (profileChanges.PfpUrl is not null)
        {
            profile.PfpUrl = profileChanges.PfpUrl;
        }

        if (profileChanges.Bio is not null)
        {
            profile.Bio = profileChanges.Bio;
        }

        if (profileChanges.DOB is not null)
        {
            profile.DOB = profileChanges.DOB;
        }

        _dbContext.Update(profile);
        _dbContext.SaveChanges();

        return Task.FromResult<UserProfile?>(profile.ToProfile());
    }
}