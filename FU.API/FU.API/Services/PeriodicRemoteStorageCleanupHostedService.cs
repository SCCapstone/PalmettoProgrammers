namespace FU.API.Services;

using FU.API.Interfaces;

/// <summary>
/// Periodically cleans out unused avatars from remote storage.
/// </summary>
public class PeriodicRemoteStorageCleanerHostedService : BackgroundService
{
    private readonly ILogger<PeriodicRemoteStorageCleanerHostedService> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public PeriodicRemoteStorageCleanerHostedService(ILogger<PeriodicRemoteStorageCleanerHostedService> logger, IServiceScopeFactory serviceScopeFactory)
    {
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Remote storage cleaner hosted Service is running.");

        // When the timer should have no due-time, then do the work once now.
        await DoWork();

        using PeriodicTimer timer = new(TimeSpan.FromHours(12));

        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await DoWork();
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Remote storage cleaner hosted Service is stopping.");
        }
    }

    private async Task DoWork()
    {
        _logger.LogInformation("Remote storage cleaner service is working.");

        using IServiceScope scope = _serviceScopeFactory.CreateScope();
        IStorageService remoteStorageService = scope.ServiceProvider.GetRequiredService<IStorageService>();

        await remoteStorageService.DeleteOldUnusedFilesAsync();
    }
}
