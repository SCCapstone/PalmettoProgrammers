import AuthService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getConnectedPosts = async () => {
  const response = await fetch(
    `${API_BASE_URL}/users/current/connected/posts`,
    { headers: { ...AuthService.getAuthHeader() } },
  );

  if (!response.ok) {
    throw new Error('Error getting posts');
  }

  return await response.json();
};

const UserService = { getConnectedPosts };
export default UserService;
