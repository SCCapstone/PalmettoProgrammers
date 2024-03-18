namespace FU.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using FU.API.Services;
using Microsoft.AspNetCore.Authorization;
using FU.API.Interfaces;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AvatarController : ControllerBase
{
    private readonly IStorageService _storageService;

    public AvatarController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost]
    public async Task<IActionResult> UploadAvatar(IFormFile avatarFile)
    {
        using var stream = avatarFile.OpenReadStream();
        using Stream avatarFileStream = AvatarService.ConvertToAvatarImageFile(stream);
        var newFileName = Guid.NewGuid().ToString() + ".jpg";
        var fileUri = await _storageService.UploadAsync(avatarFileStream, newFileName);

        var imageUrl = fileUri.AbsoluteUri;
        var response = new
        {
            ImageUrl = imageUrl,
        };

        return Ok(response);
    }
}
