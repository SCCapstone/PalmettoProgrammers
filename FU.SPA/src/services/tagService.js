import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

/*
  params = {
    keywords: "",
  }
*/
const searchTags = async (keyword) => {
  const response = await fetch(`${API_BASE_URL}/tags?$keyword=${keyword}`);

  return await response.json();
};

// Create tag request
const createTag = async (params) => {
  const response = await fetch(`${API_BASE_URL}/Tags`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...AuthService.getAuthHeader()
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error in tag creation');
  }
  const jsonResponse = await response.json();

  console.log(jsonResponse);
};

const TagService = { searchTags, createTag };
export default TagService;
