namespace FU.API.Services;

using FU.API.Data;
using FU.API.Models;
using FU.API.Helpers;
using FU.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using FU.API.Exceptions;

public class UserService : CommonService, IUserService
{
    private readonly AppDbContext _dbContext;
    private readonly ISearchService _searchService;

    public UserService(AppDbContext dbContext, ISearchService searchService)
        : base(dbContext)
    {
        _dbContext = dbContext;
        _searchService = searchService;
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
            // Make sure its an image already in our blob storage
            // Otherwise we are unure if the image is cropped and resized properly
            if (!profileChanges.PfpUrl.Contains("storagefu.blob.core.windows.net/avatars"))
            {
                throw new UnprocessableException("Invalid profile picture. The image must be uploaded to our storage system");
            }

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
