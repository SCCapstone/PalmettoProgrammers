namespace FU.API.Interfaces;

using FU.API.Models;

public interface IEmailService
{
    Task SendEmail(EmailType emailType, ApplicationUser user);
}
