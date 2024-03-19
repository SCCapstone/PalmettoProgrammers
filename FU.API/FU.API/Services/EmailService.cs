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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

public class EmailService : IEmailService
{
    private readonly EmailClient _emailClient;

    private readonly IConfiguration _configuration;

    private string baseSpaUrl = "http://http://localhost:5173/";

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;

        string? connectionString = _configuration[ConfigKey.EmailConnectionString];
        _emailClient = new EmailClient(connectionString);

        baseSpaUrl = _configuration[ConfigKey.BaseSpaUrl] ?? baseSpaUrl;
    }

    public Task SendEmail(EmailType emailType, ApplicationUser user)
    {
        _ = Task.Run(async () =>
        {
            var emailSendOperation = await _emailClient.SendAsync(
                WaitUntil.Started,
                senderAddress: "DoNotReply@72e78c7f-bd50-4dee-b29d-3853bd1e3fa1.azurecomm.net",
                recipientAddress: user.Email,
                subject: GenerateEmailSubject(emailType),
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

    private string GenerateEmailSubject(EmailType emailType)
    {
        return emailType switch
        {
            EmailType.ConfirmAccount => "Confirm your Forces Unite account",
            EmailType.Welcome => "Welcome to Forces Unite",
            _ => "Ignore this email",
        };
    }

    private string GenerateConfirmAccountEmail(ApplicationUser user)
    {
        var token = GenerateJwtToken(user);

        string message = $@"
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Confirm Your Account</title>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            margin: 0;
                            padding: 0;
                        }}
                        .container {{
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }}
                        .header {{
                            text-align: center;
                            margin-bottom: 20px;
                        }}
                        .footer {{
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                        }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>Confirm Your Account</h2>
                        </div>
                        <p>Dear {user.Username},</p>
                        <p>To confirm your account, please click on the following link:</p>
                        <p><a href='{baseSpaUrl}signin?token={token}' style='padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;'>Confirm Account</a></p>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                        <div class='footer'>
                            <p>Best regards,<br/>Forces Unite Team</p>
                        </div>
                    </div>
                </body>
                </html>";

        return message;
    }

    private string GenerateWelcomeEmail(ApplicationUser user)
    {
        string token = GenerateJwtToken(user);

        string message = $@"
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Welcome to Forces Unite</title>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            margin: 0;
                            padding: 0;
                        }}
                        .container {{
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }}
                        .header {{
                            text-align: center;
                            margin-bottom: 20px;
                        }}
                        .footer {{
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                        }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>Welcome to Forces Unite</h2>
                        </div>
                        <p>Dear {user.Username},</p>
                        <p>Thank you for registering with us!</p>
                        <p>To confirm your account, please click on the following link:</p>
                        <p><a href='{baseSpaUrl}signin?token={token}' style='padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;'>Confirm Account</a></p>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                        <div class='footer'>
                            <p>Best regards,<br/>Forces Unite Team</p>
                        </div>
                    </div>
                </body>
                </html>";

        return message;
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
