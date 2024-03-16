namespace FU.API.Services;

using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Interfaces;

public class RemoteStorageService : IRemoteStorageService
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _dbContext;
    private readonly ILogger<IRemoteStorageService> _logger;

    public RemoteStorageService(IConfiguration config, AppDbContext dbContext, ILogger<IRemoteStorageService> logger)
    {
        _config = config;
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<Uri> UploadAsync(Stream stream, Guid fileId)
    {
        return await UploadAsync(stream, GetFileName(fileId));
    }

    public async Task<Uri> UploadAsync(Stream stream, string fileName)
    {
        BlobClient blob = GetBlobClient(fileName);

        if (await blob.ExistsAsync())
        {
            throw new ConflictException("File already uploaded");
        }

        await blob.UploadAsync(stream);

        return blob.Uri;
    }

    public async Task DeleteOldUnusedFilesAsync()
    {
        BlobContainerClient container = GetBlobContainer();

        // Assumes file name like 355975c6-7c1e-42dc-99c6-a62ddacf0452.jpg with a length of 40
        // Assumes PfpUrl doesn't have any parameters
        var usedAvatarFileNames = _dbContext.Users
            .Select(u => u.PfpUrl.Substring(u.PfpUrl.Length - 40))
            .ToHashSet();

        // Skeleton from https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-list
        try
        {
            // Call the listing operation and return pages of the specified size.
            var resultSegment = container.GetBlobsAsync().AsPages();

            // Enumerate the blobs returned for each page.
            await foreach (Page<BlobItem> blobPage in resultSegment)
            {
                foreach (BlobItem blobItem in blobPage.Values)
                {
                    // Don't delete newly created blobs
                    // This for when the user has uploaded, but not yet set their avatar
                    if (blobItem.Properties.CreatedOn is not null && blobItem.Properties.CreatedOn.Value.UtcDateTime.AddMinutes(30) > DateTime.UtcNow)
                    {
                        continue;
                    }

                    // Don't delete blobs connected to a user
                    if (usedAvatarFileNames.Contains(blobItem.Name))
                    {
                        continue;
                    }

                    _logger.LogInformation("Deleting blob file {blobItem.Name}", blobItem.Name);
                    await DeleteFileAsync(blobItem.Name);
                }
            }
        }
        catch (RequestFailedException e)
        {
            _logger.LogWarning("Blob request failed: {e.Message}", e.Message);
        }
    }

    public async Task<bool> DeleteFileAsync(Guid fileId)
    {
        return await DeleteFileAsync(GetFileName(fileId));
    }

    public Uri GetUri(Guid fileId)
    {
        return GetBlobClient(GetFileName(fileId)).Uri;
    }

    public string GetFileName(Guid fileId) => $"{fileId}.jpg";

    private async Task<bool> DeleteFileAsync(string fileName)
    {
        BlobClient blob = GetBlobClient(fileName);

        return await blob.DeleteIfExistsAsync();
    }

    private BlobContainerClient GetBlobContainer()
    {
        return new BlobContainerClient(_config[ConfigKey.StorageConnectionString], _config[ConfigKey.AvatarContainerName]);
    }

    private BlobClient GetBlobClient(string blobName)
    {
        return GetBlobContainer().GetBlobClient(blobName);
    }
}
