namespace FU.API.Helpers;

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

public class NonEmptyStringAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(
        object? value, ValidationContext validationContext)
    {
        if (value is string && (string)value == string.Empty)
        {
            return new ValidationResult("String can't be empty");
        }

        return ValidationResult.Success;
    }
}
