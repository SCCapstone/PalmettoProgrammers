namespace FU.API.Data;

using FU.API.Helpers;
using Microsoft.EntityFrameworkCore;

public class ContextFactory
{
    private static DbContextOptionsBuilder<AppDbContext>? _optionsBuilder;

    public static void SetConfiguration(DbContextOptionsBuilder<AppDbContext> optionsBuilder)
    {
        _optionsBuilder = optionsBuilder;
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
