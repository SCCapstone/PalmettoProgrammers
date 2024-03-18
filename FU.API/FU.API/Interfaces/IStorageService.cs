namespace FU.API.Interfaces;

public interface IStorageService
{
    public Task<Uri> UploadAsync(Stream stream, string fileName);

    public Task<bool> DeleteFileAsync(Guid fileId);

    public Task DeleteOldUnusedFilesAsync();

    public Uri GetUri(Guid fileId);
}
