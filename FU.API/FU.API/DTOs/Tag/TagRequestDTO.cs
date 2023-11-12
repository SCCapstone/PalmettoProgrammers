namespace FU.API.DTOs.Tag
{
    using FU.API.Validation;

    public class TagRequestDTO
    {
        [NoSpaces]
        public string Name { get; set; } = string.Empty;
    }
}
