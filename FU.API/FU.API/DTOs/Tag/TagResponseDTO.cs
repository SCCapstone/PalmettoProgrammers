namespace FU.API.DTOs.Tag;

/// <summary>
/// The response DTO for tags.
/// Includes the tag's id and name.
/// </summary>
public class TagResponseDTO
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
}
