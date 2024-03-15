namespace FU.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using FU.API.Services;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    [HttpPost]
    [Route("avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile formFile)
    {
        using var stream = formFile.OpenReadStream();
        using Stream avatarFileStream = AvatarService.ConvertToAvatarImageFile(stream);
        await StorageService.SaveToTempFileAsync(avatarFileStream);

        return Ok();
    }
}
