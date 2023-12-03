import config from '../config';

const API_BASE_URL = config.API_URL;

const getPostDetails = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

  if (!response.ok) {
    throw new Error('Error getting post details');
  }

  return await response.json();
};

const PostService = { getPostDetails };
export default PostService;
