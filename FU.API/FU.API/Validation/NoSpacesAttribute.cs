namespace FU.API.Validation;

using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

public class NoSpacesAttribute : ValidationAttribute
{
    private readonly string? propertyName;

    public NoSpacesAttribute([CallerMemberName] string? propertyName = null)
    {
        this.propertyName = propertyName;
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string stringValue)
        {
            if (stringValue.Contains(' '))
            {
                return new ValidationResult($"{propertyName} cannot contain spaces.");
            }
        }

        return ValidationResult.Success;
    }
}
