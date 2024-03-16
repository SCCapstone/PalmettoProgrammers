namespace FU.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using FU.API.Services;

[ApiController]
[Route("api/[controller]")]
public class AvatarController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> UploadAvatar(IFormFile avatarFile)
    {
        using var stream = avatarFile.OpenReadStream();
        using Stream avatarFileStream = AvatarService.ConvertToAvatarImageFile(stream);
        Guid fileId = await TemporaryStorageService.SaveToFileAsync(avatarFileStream);

        return CreatedAtRoute("Get", new { id = fileId }, new { id = fileId });
    }

    [HttpGet("{id}.jpg", Name = "Get")]
    public IActionResult GetAvatarPreview(Guid id)
    {
        Stream? stream = TemporaryStorageService.GetFileStream(id);

        if (stream is null)
        {
            return NotFound();
        }

        return File(stream, "image/jpeg", "avatar.jpg");
    }
}
