namespace FU.API.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class TagRelation
    {
        public int Id { get; set; }
        public Tag Tag { get; set; }
        public int TagId { get; set; }
    }
}
