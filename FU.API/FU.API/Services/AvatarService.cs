namespace FU.API.Services;

using SkiaSharp;
using FU.API.Exceptions;

public static class AvatarService
{
    public static Stream NormalizeAvatar(Stream stream)
    {
        SKBitmap bitmap = SKBitmap.Decode(stream)
            ?? throw new UnprocessableException("Filetype not supported.");

        bitmap = CropToCenteredSquare(bitmap);
        bitmap = ResizeToAvatarSize(bitmap);

        return ToImageFileStream(bitmap);
    }

    private static Stream ToImageFileStream(SKBitmap bitmap)
    {
        MemoryStream memStream = new MemoryStream();
        using SKManagedWStream wstream = new SKManagedWStream(memStream);

        int quality = 80; // from 0-100
        bool encodeSuccess = bitmap.Encode(wstream, SKEncodedImageFormat.Jpeg, quality);

        if (!encodeSuccess)
        {
            throw new ServerError("Error encoding bitmap");
        }

        memStream.Seek(0, SeekOrigin.Begin);

        return memStream;
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
}
