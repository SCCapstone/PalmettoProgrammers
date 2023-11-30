namespace FU.API.DTOs.Group;

public class GroupSimpleDTO
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int ChatId { get; set; }

    public ICollection<string> Tags { get; set; } = new HashSet<string>();
}
