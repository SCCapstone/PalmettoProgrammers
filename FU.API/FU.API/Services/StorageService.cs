namespace FU.API.Services;

public static class StorageService
{
    public static async Task<Guid> SaveToTempFileAsync(Stream stream)
    {
        Guid fileId = Guid.NewGuid();
        string fileDirectory = $"{Path.GetTempPath()}/ForcesUnite/";

        if (!Directory.Exists(fileDirectory))
        {
            Directory.CreateDirectory(fileDirectory);
        }

        string filePath = $"{fileDirectory}/{fileId.ToString()}";

        using (var fileStream = System.IO.File.Create(filePath))
        {
            await stream.CopyToAsync(fileStream);
        }

        return fileId;
    }
}
