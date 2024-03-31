namespace FU.API.Helpers;

using FU.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public static class AuthHelper
{
    public static AuthenticationInfo CreateAuthInfo(IConfiguration configuration, DateTime expires, int userId)
    {
        // Get the secret key from the config
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetJwtSecretFromConfig()));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new()
        {
            new Claim(CustomClaimTypes.UserId, userId.ToString())
        };

        var tokenOptions = new JwtSecurityToken(signingCredentials: signingCredentials, expires: expires, claims: claims);

        string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return new AuthenticationInfo(token, tokenOptions.ValidTo);
    }

    private static string GetJwtSecretFromConfig(this IConfiguration configuration)
    {
        return configuration[ConfigKey.JwtSecret] ?? string.Empty;
    }

}
