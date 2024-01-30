namespace FU.API.Validation;

using FU.API.Models;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

public class RelationStatusAttribute : ValidationAttribute
{
    private const UserRelationStatus BlockedStatus = UserRelationStatus.Blocked;

    private readonly string? propertyName;

    public RelationStatusAttribute([CallerMemberName] string? propertyName = null)
    {
        this.propertyName = propertyName;
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string stringValue)
        {
            bool valid = false;

            // Try get the value of the string property compared to UserRelationStatus
            if (Enum.TryParse<UserRelationStatus>(stringValue, out UserRelationStatus status))
            {
                // If the status is blocked, return an error
                if (status == BlockedStatus)
                {
                    return new ValidationResult($"{propertyName} cannot be {BlockedStatus}.");
                }

                // Compare the property name to the property name of the UserRelationStatus enum
                // If they are the same, the value is valid
                valid = stringValue.Equals(status.ToString(), StringComparison.OrdinalIgnoreCase);
            }

            if (!valid)
            {
                return new ValidationResult($"{stringValue} is not a valid {nameof(UserRelationStatus)}.");
            }
        }

        return ValidationResult.Success;
    }
}
