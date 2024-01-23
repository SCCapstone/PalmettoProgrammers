import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

/*
  params = {
    keywords: "",
  }
*/
const searchTags = async (keyword) => {
  keyword = encodeURIComponent(keyword)
  const response = await fetch(`${API_BASE_URL}/tags?$keyword=${keyword}`);

  return await response.json();
};

const findTagByName = async (name) => {
  let tags = await searchTags(name);
  console.log(tags);

  let tag = null;

  for (const t of tags) {
    if (t.name == name) tag = t
  }

  return tag;
}

const findOrCreateTagByName = async (name) => {
  let tag = await findTagByName(name)

  if (!tag) {
    tag = await createTag({ Name: name })
  }

  return tag
}

// Create tag request
const createTag = async (params) => {
  const response = await fetch(`${API_BASE_URL}/Tags`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error in tag creation');
  }
  const jsonResponse = await response.json();

  console.log(jsonResponse);

  return jsonResponse;
};

const TagService = { searchTags, createTag, findTagByName, findOrCreateTagByName };
export default TagService;
