namespace FU.API.Services;

// Periodically cleans out old temporary files
public class PeriodicTempStorageCleanupHostedService : BackgroundService
{
    private readonly ILogger<PeriodicTempStorageCleanupHostedService> _logger;

    public PeriodicTempStorageCleanupHostedService(ILogger<PeriodicTempStorageCleanupHostedService> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Timed Hosted Service running.");

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
            _logger.LogInformation("Temp Storage Cleanup Hosted Service is stopping.");
        }
    }

    // Could also be a async method, that can be awaited in ExecuteAsync above
    private void DoWork()
    {
        _logger.LogInformation("Temp Storage Cleanup Service is working.");
        StorageService.DeleteOldTempFiles();
    }
}
