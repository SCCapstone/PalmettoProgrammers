namespace FU.API.Controllers
{
    using FU.API.DTOs.Tag;
    using FU.API.Exceptions;
    using FU.API.Helpers;
    using FU.API.Interfaces;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTag([FromBody] TagRequestDTO dto)
        {
            var user = await _tagService.GetCurrentUser(User) ?? throw new UnauthorizedException();

            var tagName = dto.Name;
            var tag = await _tagService.GetTag(tagName);

            if (tag is not null)
            {
                return BadRequest("Tag already exists");
            }

            tag = await _tagService.CreateTag(tagName);

            return await GetTag(tag.Id);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetTags([FromQuery(Name = "keyword")] string? tagName)
        {
            tagName ??= string.Empty;

            var tags = await _tagService.GetTags(tagName);

            var response = tags.ToDtos();

            return Ok(response);
        }

        [HttpGet]
        [Route("{tagId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTag(int tagId)
        {
            var tag = await _tagService.GetTag(tagId);

            if (tag is null)
            {
                return NotFound("Tag not found");
            }

            var response = tag.ToDto();

            return Ok(response);
        }

        [HttpPatch]
        [Route("{tagId}")]
        public async Task<IActionResult> UpdateTag(int tagId, [FromBody] TagRequestDTO dto)
        {
            var user = await _tagService.GetCurrentUser(User) ?? throw new UnauthorizedException();

            if (!user.IsAdmin)
            {
                return Unauthorized("User is not authorized");
            }

            var tag = await _tagService.GetTag(tagId);

            if (tag is null)
            {
                return NotFound("Tag not found");
            }

            tag.Name = dto.Name;

            var updatedTag = await _tagService.UpdateTag(tag);

            var response = updatedTag.ToDto();

            return Ok(response);
        }

        [HttpDelete]
        [Route("{tagId}")]
        public async Task<IActionResult> DeleteTag(int tagId)
        {
            var user = await _tagService.GetCurrentUser(User) ?? throw new UnauthorizedException();

            if (!user.IsAdmin)
            {
                return Unauthorized("User is not authorized");
            }

            var tag = await _tagService.GetTag(tagId);

            if (tag is null)
            {
                return NotFound("Tag not found");
            }

            await _tagService.DeleteTag(tag);

            return NoContent();
        }
    }
}
