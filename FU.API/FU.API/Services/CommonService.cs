namespace FU.API.Services;

using FU.API.Data;
using FU.API.Helpers;
using FU.API.Interfaces;
using FU.API.Models;
using System.Security.Claims;

public class CommonService : ICommonService
{
    private readonly AppDbContext _dbContext;

    public CommonService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApplicationUser?> GetCurrentUser(ClaimsPrincipal claims)
    {
        var stringId = claims.FindFirstValue(CustomClaimTypes.UserId);

        if (stringId is null || !int.TryParse(stringId, out int userId))
        {
            throw new UnauthorizedAccessException();
        }

        // Get the user from the database
        return await _dbContext.Users.FindAsync(userId);
    }

    public async Task<ApplicationUser?> GetUser(int userId)
    {
        return await _dbContext.Users.FindAsync(userId);
    }
}