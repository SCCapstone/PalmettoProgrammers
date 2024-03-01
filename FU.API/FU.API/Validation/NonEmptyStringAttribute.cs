namespace FU.API.Validation;

using System.ComponentModel.DataAnnotations;

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
