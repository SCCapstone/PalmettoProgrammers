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

// Update post information
const updatePost = async (params, postId) => {
  const response = await fetch(`${API_BASE_URL}/Posts/${postId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error in updating post');
  }
  const jsonResponse = await response.json();

  console.log(jsonResponse);

  return jsonResponse;
};

// Get details of post in JSON format
const getPostDetails = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'GET',
    headers: {
      ...(AuthService.getAuthHeader() ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error('Error in post creation');
  }

  const jsonResponse = await response.json();

  console.log(jsonResponse);

  return jsonResponse;
};

// Get all users of a post in JSON format
const getPostUsers = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/users`, {
    method: 'GET',
  });
  const jsonResponse = await response.json();

  console.log(jsonResponse);

  return jsonResponse;
};

// Request to join a post as current user
const joinPost = async (postId) => {
  await fetch(`${API_BASE_URL}/Posts/${postId}/users/current`, {
    method: 'POST',
    headers: {
      ...AuthService.getAuthHeader(),
    },
  });
};

// Request to leave a post as current user
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
  updatePost,
  getPostDetails,
  joinPost,
  leavePost,
  getPostUsers,
};
export default PostService;
