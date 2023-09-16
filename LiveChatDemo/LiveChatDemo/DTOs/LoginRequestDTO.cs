using System.ComponentModel.DataAnnotations;

namespace LiveChatDemo.DTOs
{
    public class LoginRequestDTO
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}