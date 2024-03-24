namespace FU.API.Validation;

using System.ComponentModel.DataAnnotations;

public class EmailAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(
        object? value, ValidationContext validationContext)
    {
        // Confirm that the value is a valid email
        if (value is string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return ValidationResult.Success;
            }
            catch
            {
                return new ValidationResult("Invalid email address");
            }
        }

        return ValidationResult.Success;
    }
}
