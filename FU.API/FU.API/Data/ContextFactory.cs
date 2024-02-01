namespace FU.API.Data;

using FU.API.Helpers;
using Microsoft.EntityFrameworkCore;

public class ContextFactory
{
    private static DbContextOptionsBuilder<AppDbContext>? _optionsBuilder;

    public static void SetOptions(Action<DbContextOptionsBuilder>? optionsAction = null)
    {
        // Set the db context options
        _optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsAction?.Invoke(_optionsBuilder);

        // Validate the options
        if (_optionsBuilder.IsConfigured is false)
        {
            throw new InvalidOperationException("No options are configured");
        }
    }

    public static AppDbContext CreateDbContext()
    {
        if (_optionsBuilder is null)
        {
            throw new InvalidOperationException("Option builder is not set");
        }

        return new AppDbContext(_optionsBuilder.Options);
    }
}
