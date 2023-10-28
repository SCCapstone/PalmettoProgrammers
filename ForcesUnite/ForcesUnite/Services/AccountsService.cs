using System.IdentityModel.Tokens.Jwt;
using System.Text;
using ForcesUnite.Models;
using Microsoft.IdentityModel.Tokens;

namespace ForcesUnite.Services;

public class AccountsService
{
    public bool Authenticate(Credentials credentials)
    {
        // TODO check username and password against db
        return true;
    }

    public Task<string?> GetAuthToken(Credentials credentials)
    {
        if (!Authenticate(credentials)) return Task.FromResult<string?>(null);

        // TODO get from config
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey1234567890"));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        // TODO add expiration date
        var tokenOptions = new JwtSecurityToken(signingCredentials: signingCredentials);

        string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return Task.FromResult<string?>(token);
    }
}