﻿namespace FU.API.Interfaces
{
    using FU.API.Models;

    public interface IPostService : ICommonService
    {
        Task<Post> CreatePost(Post post);

        Task<Post?> GetPost(int postId);
    }
}