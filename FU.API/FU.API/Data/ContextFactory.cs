namespace FU.API.Data;

using FU.API.Helpers;
using Microsoft.EntityFrameworkCore;

public class ContextFactory
{
    private static IConfiguration? _configuration;

    public static void SetConfiguration(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public static AppDbContext CreateDbContext()
    {
        if (_configuration is null)
        {
            throw new InvalidOperationException("Configuration has not been set.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(_configuration[ConfigKey.ConnectionString]);

        return new AppDbContext(optionsBuilder.Options);
    }

    public static AppDbContext CreateDbContext(IConfiguration configuration)
    {
        if (configuration is null)
        {
            throw new InvalidOperationException("Configuration has not been set.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(configuration[ConfigKey.ConnectionString]);

        return new AppDbContext(optionsBuilder.Options);
    }
}
