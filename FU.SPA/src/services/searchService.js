import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';
import StringBuilderService from './stringBuilderService';

/*
  params = {
    keywords: "",
  }
*/
const searchPosts = async (query) => {
  var queryString = StringBuilderService.buildPostQueryString(query);

  let authHeader = null;
  try {
    authHeader = AuthService.getAuthHeader();
  } catch {
    // Nothing
  }

  const response = await fetch(`${API_BASE_URL}/search/posts?${queryString}`, {
    headers: {
      ...(authHeader ? { ...authHeader } : {}),
    },
  });

  return await response.json();
};

const SearchService = { searchPosts };
export default SearchService;
