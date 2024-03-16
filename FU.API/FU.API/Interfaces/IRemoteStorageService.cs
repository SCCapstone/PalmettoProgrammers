namespace FU.API.Interfaces;

public interface IRemoteStorageService
{
    public Task<Uri> UploadAsync(Stream stream, Guid fileId);

    public Task<bool> DeleteFileAsync(Guid fileId);

    public Uri GetUri(Guid fileId);
}
