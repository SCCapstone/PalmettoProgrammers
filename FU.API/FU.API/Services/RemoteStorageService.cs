namespace FU.API.Services;

using Azure.Storage.Blobs;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Interfaces;

public class RemoteStorageService : IRemoteStorageService
{
    private readonly IConfiguration _config;

    public RemoteStorageService(IConfiguration config)
    {
        _config = config;
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

    public async Task<bool> DeleteFileAsync(Guid fileId)
    {
        return await DeleteFileAsync(GetFileName(fileId));
    }

    public async Task<bool> DeleteFileAsync(string fileName)
    {
        BlobClient blob = GetBlobClient(fileName);

        return await blob.DeleteIfExistsAsync();
    }

    public Uri GetUri(Guid fileId)
    {
        return GetBlobClient(GetFileName(fileId)).Uri;
    }

    public string GetFileName(Guid fileId) => $"{fileId}.jpg";

    private BlobClient GetBlobClient(string blobName)
    {
        BlobContainerClient container = new BlobContainerClient(_config[ConfigKey.StorageConnectionString], _config[ConfigKey.AvatarContainerName]);

        return container.GetBlobClient(blobName);
    }
}
