namespace FU.API.Services;

public static class StorageService
{
    public static async Task<Guid> SaveToTempFileAsync(Stream stream)
    {
        Guid fileId = Guid.NewGuid();
        string fileDirectory = GetTempDirectory();

        if (!Directory.Exists(fileDirectory))
        {
            Directory.CreateDirectory(fileDirectory);
        }

        string filePath = GetFilePath(fileId);

        using (var fileStream = System.IO.File.Create(filePath))
        {
            await stream.CopyToAsync(fileStream);
        }

        return fileId;
    }

    public static void DeleteTempFile(Guid fileId)
    {
        string filePath = GetFilePath(fileId);

        if (!File.Exists(filePath))
        {
            return;
        }

        File.Delete(filePath);
    }

    private static string GetTempDirectory() => $"{Path.GetTempPath()}/ForcesUnite/";

    private static string GetFilePath(Guid id) => $"{GetTempDirectory()}/{id.ToString()}";
}
