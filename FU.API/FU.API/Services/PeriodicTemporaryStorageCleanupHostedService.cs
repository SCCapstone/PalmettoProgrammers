namespace FU.API.Services;

// Periodically cleans out old temporary files
public class PeriodicTemporaryStorageCleanupHostedService : BackgroundService
{
    private readonly ILogger<PeriodicTemporaryStorageCleanupHostedService> _logger;

    public PeriodicTemporaryStorageCleanupHostedService(ILogger<PeriodicTemporaryStorageCleanupHostedService> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Temporary storage cleaner hosted Service is running.");

        // When the timer should have no due-time, then do the work once now.
        DoWork();

        using PeriodicTimer timer = new(TimeSpan.FromMinutes(20));

        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                DoWork();
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Temporary storage cleaner hosted service is stopping.");
        }
    }

    // Could also be a async method, that can be awaited in ExecuteAsync above
    private void DoWork()
    {
        _logger.LogInformation("Temporary storage cleaner hosted service is working.");
        TemporaryStorageService.DeleteOldFiles();
    }
}
