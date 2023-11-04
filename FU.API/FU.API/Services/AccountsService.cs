using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FU.API.Helpers;
using Microsoft.IdentityModel.Tokens;
using Konscious.Security.Cryptography;
using FU.API.Data;
using FU.API.Models;
using FU.API.Exceptions;

namespace FU.API.Services;

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
    private Task<UserCredentials?> authenticate(Credentials credentials)
    {
        UserCredentials userCredentials;

        userCredentials = _dbContext.UserCredentials.Where(c => c.Username == credentials.Username).Single();

        if (userCredentials.PasswordHash == hashPassword(credentials.Password))
        {
            return Task.FromResult<UserCredentials?>(userCredentials);
        }
        else
        {
            return Task.FromResult<UserCredentials?>(null);
        }
    }

    public Task<UserCredentials?> Register(Credentials credentials)
    {
        var queryUser = _dbContext.UserCredentials.Where(c => c.Username == credentials.Username);
        if (queryUser.FirstOrDefault() is not null)
        {
            throw new DuplicateUserException();
        }

        _dbContext.UserCredentials.Add(new UserCredentials()
        {
            Username = credentials.Username,
            PasswordHash = hashPassword(credentials.Password),
        });
        _dbContext.SaveChanges();

        return Task.FromResult<UserCredentials?>(queryUser.First());
    }

    public async Task<AuthenticationInfo?> GetUserAuthInfo(Credentials credentials)
    {
        UserCredentials? userCredentials = await authenticate(credentials);
        if (userCredentials is null) return null;

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[ConfigKey.JwtSecret] ?? ""));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new()
        {
            new(CustomClaimTypes.UserId, userCredentials.UserId.ToString())
        };

        var tokenOptions = new JwtSecurityToken(signingCredentials: signingCredentials, expires: DateTime.UtcNow.AddMinutes(120), claims: claims);

        string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return new AuthenticationInfo(token, tokenOptions.ValidTo);
    }

    private string hashPassword(string password)
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
        var userCredentials = _dbContext.UserCredentials.Find(userId);
        if (userCredentials is null) return null;

        return new AccountInfo()
        {
            UserId = userCredentials.UserId,
            Username = userCredentials.Username,
        };
    }
}