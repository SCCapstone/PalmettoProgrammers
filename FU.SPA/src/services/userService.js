import AuthService from './authService';
import RequestBuilder from '../helpers/requestBuilder';

import config from '../config';
const API_BASE_URL = config.API_URL;

const getConnectedPosts = async (query) => {
  var queryString = RequestBuilder.buildPostQueryString(query);
  const response = await fetch(
    `${API_BASE_URL}/users/current/connected/posts?${queryString}`,
    { headers: { ...AuthService.getAuthHeader() } },
  );

  if (!response.ok) {
    throw new Error('Error getting posts');
  }

  return await response.json();
};

const getConnectedGroups = async () => {
  const response = await fetch(
    `${API_BASE_URL}/users/current/connected/groups`,
    { headers: { ...AuthService.getAuthHeader() } },
  );

  if (!response.ok) {
    throw new Error('Error getting groups');
  }

  return await response.json();
};

const getConnectedPlayers = async () => {
  const response = await fetch(
    `${API_BASE_URL}/users/current/connected/players`,
    { headers: { ...AuthService.getAuthHeader() } },
  );

  if (!response.ok) {
    throw new Error('Error getting players');
  }

  return await response.json();
};

const getUserprofile = async (userString) => {
  const response = await fetch(`${API_BASE_URL}/users/${userString}`, {
    headers: { ...AuthService.getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error('Error getting groups');
  }

  return await response.json();
};

const getUserId = async () => {
  const response = await fetch(`${API_BASE_URL}/Accounts`, {
    headers: { ...AuthService.getAuthHeader() },
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error('Error in retrieving ID');
  }
  
  return await response.json();
}

const updateUserProfile = async (data) => {
  console.log(JSON.stringify(data));
  const response = await fetch(`${API_BASE_URL}/Users/current`, {
    method: 'PATCH',
    headers: { ...AuthService.getAuthHeader() },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Error in updating information');
  }

  return await response.json();
}

const UserService = {
  getConnectedPosts,
  getConnectedGroups,
  getConnectedPlayers,
  getUserprofile,
  getUserId,
  updateUserProfile
};
export default UserService;
