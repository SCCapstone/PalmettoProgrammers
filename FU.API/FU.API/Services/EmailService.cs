namespace FU.API.Services;

using Azure;
using Azure.Communication.Email;
using FU.API.Helpers;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

public class EmailService : IEmailService
{
    private readonly EmailClient _emailClient;

    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;

        string? connectionString = _configuration[ConfigKey.EmailConnectionString];
        _emailClient = new EmailClient(connectionString);
    }

    public Task SendEmail(EmailType emailType, ApplicationUser user)
    {
        _ = Task.Run(async () =>
        {
            var emailSendOperation = await _emailClient.SendAsync(
                WaitUntil.Started,
                senderAddress: "DoNotReply@72e78c7f-bd50-4dee-b29d-3853bd1e3fa1.azurecomm.net",
                recipientAddress: user.Email,
                subject: "Test Email",
                htmlContent: GenerateEmailContent(emailType, user));
        });

        return Task.CompletedTask;
    }

    private string GenerateEmailContent(EmailType emailType, ApplicationUser user)
    {
        return emailType switch
        {
            EmailType.ConfirmAccount => GenerateConfirmAccountEmail(user),
            EmailType.Welcome => GenerateWelcomeEmail(user),
            _ => string.Empty,
        };
    }

    private string GenerateConfirmAccountEmail(ApplicationUser user)
    {
        var token = GenerateJwtToken(user);
        return token;
    }

    private string GenerateWelcomeEmail(ApplicationUser user)
    {
        var token = GenerateJwtToken(user);
        return token;
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[ConfigKey.JwtSecret] ?? string.Empty));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new()
        {
            new (CustomClaimTypes.UserId, user.UserId.ToString())
        };

        var tokenOptions = new JwtSecurityToken(signingCredentials: signingCredentials, expires: DateTime.UtcNow.AddMinutes(30), claims: claims);

        return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
    }
}
