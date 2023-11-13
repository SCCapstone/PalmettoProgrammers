namespace FU.API.Interfaces
{
    using FU.API.Models;

    public interface IPostService
    {
        Task<Post?> CreatePost(Post post);

        Task<Post?> GetPost(int postId);

        Task<IEnumerable<Post>?> GetPosts();
    }
}
