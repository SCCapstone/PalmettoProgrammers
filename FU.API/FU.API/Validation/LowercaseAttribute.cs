namespace FU.API.Validation;

using System.ComponentModel.DataAnnotations;

public class LowercaseAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(
        object? value, ValidationContext validationContext)
    {
        if (value is string && ((string)value).ToLower() != (string)value)
        {
            return new ValidationResult("String must be lowercase");
        }

        return ValidationResult.Success;
    }
}
