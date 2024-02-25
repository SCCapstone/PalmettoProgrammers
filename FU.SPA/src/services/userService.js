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

// TODO return *just* id or rename function name
// Currently this function returns the username and id
const getUserIdJson = async () => {
  // Call API endpoint
  const response = await fetch(`${API_BASE_URL}/Accounts`, {
    headers: { ...AuthService.getAuthHeader() },
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Error in retrieving ID');
  }

  return await response.json();
};

// Updates Profile Information
const updateUserProfile = async (data) => {
  // Call API endpoint
  const response = await fetch(`${API_BASE_URL}/Users/current`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error in updating information');
  }

  return response.json();
};

// Updates Account Information
const updateAccountInfo = async (data) => {
  const response = await fetch(`${API_BASE_URL}/Accounts`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error in updating account information');
  }
};

const UserService = {
  getConnectedPosts,
  getConnectedGroups,
  getConnectedPlayers,
  getUserprofile,
  getUserIdJson,
  updateUserProfile,
  updateAccountInfo,
};
export default UserService;
