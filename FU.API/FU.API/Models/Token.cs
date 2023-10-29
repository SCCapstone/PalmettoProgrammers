namespace FU.API.Models
{
    public class Token
    {
        public int Id { get; set; }
        public string JwtToken { get; set; }
        public DateTime Expiration { get; set; }
        public ApplicationUser User { get; set; }
    }
}
