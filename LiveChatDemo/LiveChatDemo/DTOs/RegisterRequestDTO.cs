using System.ComponentModel.DataAnnotations;

namespace LiveChatDemo.DTOs
{
    public class RegisterRequestDTO
    {
        [Required]
        public string Username {  get; set; }
        [Required]
        public string Password { get; set; }
        public string? SteamId { get; set; }
    }
}