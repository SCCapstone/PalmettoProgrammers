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

public class AccountsService
{
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _dbContext;

    public AccountsService(IConfiguration configuration, AppDbContext dbContext)
    {
        _configuration = configuration;
        _dbContext = dbContext;
    }

    // Return user credentials so userId is accessable without a second db call
    private Task<ApplicationUser?> Authenticate(Credentials credentials)
    {
        ApplicationUser user;

        user = _dbContext.Users.Where(u => u.NormalizedUsername == credentials.Username.ToUpper()).Single();

        if (user.PasswordHash == HashPassword(credentials.Password))
        {
            return Task.FromResult<ApplicationUser?>(user);
        }
        else
        {
            return Task.FromResult<ApplicationUser?>(null);
        }
    }

    public Task<ApplicationUser?> Register(Credentials credentials)
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
        _dbContext.SaveChanges();

        return Task.FromResult<ApplicationUser?>(queryUser.First());
    }

    public async Task<AuthenticationInfo?> GetUserAuthInfo(Credentials credentials)
    {
        var user = await Authenticate(credentials);
        if (user is null)
        {
            return null;
        }

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[ConfigKey.JwtSecret] ?? string.Empty));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new ()
        {
            new (CustomClaimTypes.UserId, user.UserId.ToString())
        };

        var tokenOptions = new JwtSecurityToken(signingCredentials: signingCredentials, expires: DateTime.UtcNow.AddDays(1), claims: claims);

        string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return new AuthenticationInfo(token, tokenOptions.ValidTo);
    }

    private string HashPassword(string password)
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
        };
    }
}