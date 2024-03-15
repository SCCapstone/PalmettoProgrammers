namespace FU.API.Services;

using System.IO;

public static class TemporaryStorageService
{
    public static async Task<Guid> SaveToFileAsync(Stream stream)
    {
        Guid fileId = Guid.NewGuid();
        string fileDirectory = GetTemporaryDirectory();

        if (!Directory.Exists(fileDirectory))
        {
            Directory.CreateDirectory(fileDirectory);
        }

        string filePath = GetFilePath(fileId);

        using (var fileStream = File.Create(filePath))
        {
            await stream.CopyToAsync(fileStream);
        }

        return fileId;
    }

    public static void DeleteFile(Guid fileId)
    {
        string filePath = GetFilePath(fileId);

        if (!File.Exists(filePath))
        {
            return;
        }

        File.Delete(filePath);
    }

    public static void DeleteOldFiles()
    {
        foreach (string filePath in Directory.GetFiles(GetTemporaryDirectory()))
        {
            // If file is older than 1 hour
            if (File.GetLastWriteTimeUtc(filePath).AddHours(1) < DateTime.UtcNow)
            {
                File.Delete(filePath);
            }
        }
    }

    private static string GetTemporaryDirectory() => $"{Path.GetTempPath()}/ForcesUnite/";

    private static string GetFilePath(Guid id) => $"{GetTemporaryDirectory()}/{id.ToString()}";
}
