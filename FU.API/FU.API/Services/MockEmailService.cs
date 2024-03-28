namespace FU.API.Services;

using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Interfaces;
using FU.API.Models;
using System.Threading.Tasks;

/// <summary>
/// A mock email service.
/// </summary>
/// <remarks>
/// Auto verifies an account without sending an email. Used for testing and development purposes.
/// </remarks>
public class MockEmailService : IEmailService
{
    private readonly AppDbContext _dbContext;

    public MockEmailService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SendEmail(EmailType emailType, ApplicationUser user)
    {
        if (emailType != EmailType.ConfirmAccount)
        {
            return;
        }

        var userEntity = _dbContext.Users.Find(user.UserId)
            ?? throw new NotFoundException("User not found", "The requested user was not found");

        userEntity.AccountConfirmed = true;

        _dbContext.Update(userEntity);
        await _dbContext.SaveChangesAsync();
    }
}
