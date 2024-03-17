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
        _emailClient = CreateEmailClient();
    }

    private static EmailClient CreateEmailClient()
    {
        string connectionString = "endpoint=https://communicationfu.unitedstates.communication.azure.com/;accesskey=PGEGlkGC8Beca/i87cymeDvvumi2xtxfI1L1HQH0V18SsMZ9czSnrh5SolroKUH8FN0Tyv2mYd4IDTnzgEmLMA==";
        return new EmailClient(connectionString);
    }


    public Task SendEmail(EmailType emailType, ApplicationUser user)
    {
        string connectionString = "endpoint=https://communicationfu.unitedstates.communication.azure.com/;accesskey=PGEGlkGC8Beca/i87cymeDvvumi2xtxfI1L1HQH0V18SsMZ9czSnrh5SolroKUH8FN0Tyv2mYd4IDTnzgEmLMA==";
        var emailClient = new EmailClient(connectionString);

        EmailSendOperation emailSendOperation = emailClient.Send(
            WaitUntil.Completed,
            senderAddress: "DoNotReply@72e78c7f-bd50-4dee-b29d-3853bd1e3fa1.azurecomm.net",
            recipientAddress: user.Email,
            subject: "Test Email",
            htmlContent: GenerateEmailContent(emailType, user),
            plainTextContent: "Hello world via email.");

        return Task.CompletedTask;
    }

    private string GenerateEmailContent(EmailType emailType, ApplicationUser user)
    {
        return emailType switch
        {
            EmailType.ConfirmAccount => GenerateConfirmAccountEmail(user),
            _ => string.Empty,
        };
    }

    private string GenerateConfirmAccountEmail(ApplicationUser user)
    {
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[ConfigKey.JwtSecret] ?? string.Empty));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new()
        {
            new (CustomClaimTypes.UserId, user.UserId.ToString())
        };

        var tokenOptions = new JwtSecurityToken(signingCredentials: signingCredentials, expires: DateTime.UtcNow.AddMinutes(30), claims: claims);

        var ret = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        return ret;
    }
}
