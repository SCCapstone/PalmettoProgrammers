import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';
import RequestBuilder from '../helpers/requestBuilder';

/*
  params = {
    keywords: "",
  }
*/
const searchPosts = async (query) => {
  var queryString = RequestBuilder.buildPostQueryString(query);

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

  const totalCount = parseInt(response.headers.get('x-total-count'));
  const responseData = await response.json();
  return { data: responseData, totalCount: totalCount };
};

const searchUsers = async (query) => {
  var queryString = RequestBuilder.buildUserQueryString(query);

  let authHeader = null;
  try {
    authHeader = AuthService.getAuthHeader();
  } catch {
    // Nothing
  }

  const response = await fetch(`${API_BASE_URL}/search/users?${queryString}`, {
    headers: {
      ...(authHeader ? { ...authHeader } : {}),
    },
  });

  const totalCount = parseInt(response.headers.get('x-total-count'));
  const responseData = await response.json();
  return { data: responseData, totalCount: totalCount };
};

const SearchService = { searchPosts, searchUsers };
export default SearchService;
