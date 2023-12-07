import config from '../config';
const API_BASE_URL = config.API_URL;
import { authService } from './authService'

// Create post request
const createPost = async (params) => {
  const response = await fetch(`${API_BASE_URL}/Posts`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error in post creation');
  }
  const jsonResponse = await response.json();

  console.log(jsonResponse);
};

const PostService = { createPost };
export default PostService;
