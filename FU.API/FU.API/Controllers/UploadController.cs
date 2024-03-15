namespace FU.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using System.IO;
using SkiaSharp;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    [HttpPost]
    [Route("avatar")]
    public async Task<IActionResult> UploadProfileImage(IFormFile formFile)
    {
        SKBitmap bitmap;
        using (var stream = formFile.OpenReadStream())
        {
            bitmap = SKBitmap.Decode(stream);
        }

        if (bitmap is null)
        {
            return UnprocessableEntity("Filetype not supported.");
        }

        bitmap = CropToCenteredSquare(bitmap);
        bitmap = ResizeToAvatarSize(bitmap);

        using (MemoryStream memStream = new MemoryStream())
        {
            using SKManagedWStream wstream = new SKManagedWStream(memStream);

            int quality = 80; // from 0-100
            bool encodeSuccess = bitmap.Encode(wstream, SKEncodedImageFormat.Jpeg, quality);

            memStream.Seek(0, SeekOrigin.Begin);

            await SaveToTempFileAsync(memStream);
        }

        return Ok();
    }

    private static SKBitmap ResizeToAvatarSize(in SKBitmap bitmap)
    {
        SKImageInfo newResolution = new(200, 200);
        return bitmap.Resize(newResolution, SKFilterQuality.High);
    }

    private static SKBitmap CropToCenteredSquare(in SKBitmap bitmap)
    {
        // Convert SKBitmap to SKPixmap
        SKPixmap pixmap = new(bitmap.Info, bitmap.GetPixels());

        int topOffset = 0;
        int bottomOffest = 0;
        int leftOffset = 0;
        int rightOffset = 0;
        if (pixmap.Height > pixmap.Width)
        {
            int excessHeight = pixmap.Height - pixmap.Width;
            topOffset = excessHeight / 2;
            bottomOffest = (excessHeight / 2) + (excessHeight % 2);
        }
        else if (pixmap.Height < pixmap.Width)
        {
            int excessWidth = pixmap.Width - pixmap.Height;
            leftOffset = excessWidth / 2;
            rightOffset = (excessWidth / 2) + (excessWidth % 2);
        }

        var croppedPixmap = pixmap.ExtractSubset(new SKRectI(leftOffset, topOffset, pixmap.Width - rightOffset, pixmap.Height - bottomOffest));

        // Convert SKPixmap back to SKBitmap
        SKBitmap newBitmap = new();
        newBitmap.InstallPixels(croppedPixmap);

        return newBitmap;
    }

    private static async Task<Guid> SaveToTempFileAsync(Stream stream)
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
