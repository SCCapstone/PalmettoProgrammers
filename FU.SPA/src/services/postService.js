import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

// Create post request
const createPost = async (params) => {
  const response = await fetch(`${API_BASE_URL}/Posts`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error in post creation');
  }
  const jsonResponse = await response.json();

  console.log(jsonResponse);

  return jsonResponse;
};

const getPostDetails = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'GET',
    headers: {
      ...AuthService.getAuthHeader() ?? {}
    }
  });
  const jsonResponse = await response.json();

  console.log(jsonResponse);

  return jsonResponse;
};

const joinPost = async (postId) => {
  await fetch(`${API_BASE_URL}/Posts/${postId}/users/current`, {
    method: 'POST',
    headers: {
      ...AuthService.getAuthHeader(),
    },
  });
};

const leavePost = async (postId) => {
  await fetch(`${API_BASE_URL}/Posts/${postId}/users/current`, {
    method: 'DELETE',
    headers: {
      ...AuthService.getAuthHeader(),
    },
  });
};

const PostService = {
  createPost,
  getPostDetails,
  joinPost,
  leavePost
};
export default PostService;
