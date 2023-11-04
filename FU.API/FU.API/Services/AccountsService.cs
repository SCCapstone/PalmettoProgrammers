using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FU.API.Helpers;
using FU.API.Models;
using Microsoft.IdentityModel.Tokens;
using Konscious.Security.Cryptography;

namespace FU.API.Services;

public class AccountsService
{
    private readonly IConfiguration _configuration;

    public AccountsService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public bool Authenticate(Credentials credentials)
    {
        // TODO check username and password against db
        return true;
    }

    public Task<string?> GetAuthToken(Credentials credentials)
    {
        if (!Authenticate(credentials)) return Task.FromResult<string?>(null);

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[ConfigKey.JwtSecret] ?? ""));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        List<Claim> claims = new()
        {
            new(CustomClaimTypes.UserId, credentials.Username)
        };

        var tokenOptions = new JwtSecurityToken(signingCredentials: signingCredentials, expires: DateTime.UtcNow.AddMinutes(120), claims: claims);

        string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return Task.FromResult<string?>(token);
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
    }
}