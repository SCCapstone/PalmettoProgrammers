namespace FU.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using FU.API.Services;
using Microsoft.AspNetCore.Authorization;
using FU.API.Interfaces;

/// <summary>
/// Handles avatar related requests.
/// </summary>
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

    /// <summary>
    /// Normalizes and uploads an avatar image file to cloud storage.
    /// </summary>
    /// <returns>The url of the avatar on cloud storage.</returns>
    /// <param name="avatarFile">The avatar file.</param>
    [HttpPost]
    public async Task<IActionResult> UploadAvatar(IFormFile avatarFile)
    {
        using var stream = avatarFile.OpenReadStream();
        using Stream normalizedAvatar = AvatarService.NormalizeAvatar(stream);
        var newFileName = Guid.NewGuid().ToString() + ".jpg";

        var fileUri = await _storageService.UploadAsync(normalizedAvatar, newFileName);

        var response = new
        {
            ImageUrl = fileUri.AbsoluteUri,
        };
        return Ok(response);
    }
}
