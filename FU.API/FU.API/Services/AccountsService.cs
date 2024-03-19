namespace FU.API.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Models;
using Konscious.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

/// <summary>
/// Handles account related actions.
/// </summary>
public class AccountsService : CommonService
{
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="AccountsService"/> class.
    /// </summary>
    /// <param name="configuration">Allows access to the config.</param>
    /// <param name="dbContext">Allows access to the database.</param>
    public AccountsService(IConfiguration configuration, AppDbContext dbContext)
        : base(dbContext)
    {
        _configuration = configuration;
        _dbContext = dbContext;
    }

    public static string HashPassword(string password)
    {
        // based on https://gist.github.com/sixpeteunder/235f93ba0b059035abf140beb2ea4e44
        var argon2 = new Argon2i(Encoding.UTF8.GetBytes(password))
        {
            Iterations = 4,
            DegreeOfParallelism = 2,
            MemorySize = 1024 * 4,
        };

        byte[] passwordBytes = argon2.GetBytes(128);
        return Convert.ToBase64String(passwordBytes);
    }

    /// <summary>
    /// Create a new user.
    /// </summary>
    /// <param name="credentials">Credentials for the new user.</param>
    /// <returns>Returns the created user, or null if failed.</returns>
    public async Task<ApplicationUser> Register(Credentials credentials)
    {
        var queryUser = _dbContext.Users.Where(u => u.NormalizedUsername == credentials.Username.ToUpper());
        if (queryUser.FirstOrDefault() is not null)
        {
            throw new DuplicateUserException();
        }

        _dbContext.Users.Add(new ApplicationUser()
        {
            Username = credentials.Username,
            PasswordHash = HashPassword(credentials.Password),
        });
        await _dbContext.SaveChangesAsync();

        return queryUser.First();
    }

    /// <summary>
    /// Deletes a user account.
    /// </summary>
    /// <param name="userId">The user to delete.</param>
    /// <param name="credentials">Credentials of the user to delete.</param>
    /// <returns>Task.</returns>
    /// <exception cref="NotFoundException">Exception thrown to the UI if the user is not found.</exception>
    public async Task DeleteAccount(int userId, Credentials credentials)
    {
        var user = _dbContext.Users.Find(userId) ?? throw new NotFoundException("User not found", "The requested user was not found");

        // Make sure the usernames match
        if (!string.Equals(user.Username, credentials.Username, StringComparison.OrdinalIgnoreCase))
        {
            throw new UnauthorizedException("The username in the request does not match the user's username");
        }

        if (user.PasswordHash != HashPassword(credentials.Password))
        {
            throw new UnauthorizedException("The password in the request does not match the user's password");
        }

        _dbContext.Users.Remove(user);

        // When deleting a user all posts they made have the creator set to null automatically
        // But we need to manually remove posts if they were the only member
        var posts = _dbContext.Posts.Where(p => p.CreatorId == userId).ToList();
        foreach (var post in posts)
        {
            var chatMemberships = _dbContext.ChatMemberships.Where(cm => cm.ChatId == post.ChatId).ToList();
            if (chatMemberships.Count == 1)
            {
                _dbContext.Posts.Remove(post);
            }
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdatePassword(int userId, string newPassword)
    {
        ApplicationUser user = _dbContext.Users.Find(userId) ?? throw new NotFoundException("User not found", "The requested user was not found");

        user.PasswordHash = HashPassword(newPassword);
        _dbContext.Update(user);

        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateUsername(int userId, string newUsername)
    {
        ApplicationUser user = _dbContext.Users.Find(userId) ?? throw new NotFoundException("User not found", "The requested user was not found");

        var existingUserWithNewUsername = _dbContext.Users.Where(u => u.NormalizedUsername == newUsername.ToUpper()).FirstOrDefault();

        // If a different user has the same username
        if (existingUserWithNewUsername is not null && existingUserWithNewUsername.UserId != userId)
        {
            throw new DuplicateUserException();
        }

        user.Username = newUsername;
        _dbContext.Update(user);

        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Authenticates the user by returning it's info if the given credentials are valid.
    /// </summary>
    /// <param name="credentials">Credentials to authenticate with.</param>
    /// <returns>Returns the users info if successful, otherwise returns null.</returns>
    public async Task<AuthenticationInfo?> GetUserAuthInfo(Credentials credentials)
    {
        var user = await Authenticate(credentials);
        if (user is null)
        {
            return null;
        }

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[ConfigKey.JwtSecret] ?? string.Empty));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new()
        {
            new (CustomClaimTypes.UserId, user.UserId.ToString())
        };

        var tokenOptions = new JwtSecurityToken(signingCredentials: signingCredentials, expires: DateTime.UtcNow.AddDays(1), claims: claims);

        string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return new AuthenticationInfo(token, tokenOptions.ValidTo);
    }

    /// <summary>
    /// Gets the user's account info.
    /// </summary>
    /// <param name="userId">The id of the account info.</param>
    /// <returns>Returns the account info.</returns>
    public AccountInfo? GetInfo(int userId)
    {
        var userCredentials = _dbContext.Users.Find(userId);

        if (userCredentials is null)
        {
            return null;
        }

        return new AccountInfo()
        {
            UserId = userCredentials.UserId,
            Username = userCredentials.Username,
            PasswordHash = userCredentials.PasswordHash
        };
    }

    // Return user credentials so userId is accessable without a second db call
    private Task<ApplicationUser?> Authenticate(Credentials credentials)
    {
        ApplicationUser? user = _dbContext.Users.Where(u => u.NormalizedUsername == credentials.Username.ToUpper()).FirstOrDefault();

        if (user?.PasswordHash == HashPassword(credentials.Password))
        {
            return Task.FromResult<ApplicationUser?>(user);
        }
        else
        {
            return Task.FromResult<ApplicationUser?>(null);
        }
    }
}
