namespace FU.API.Interfaces;

public interface IStorageService
{
    public Task<Uri> UploadAsync(Stream stream, string fileName);

    public Task DeleteOldUnusedFilesAsync();
}
