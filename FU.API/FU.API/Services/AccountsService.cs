using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ForcesUnite.Helpers;
using ForcesUnite.Models;
using Microsoft.IdentityModel.Tokens;

namespace ForcesUnite.Services;

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
}