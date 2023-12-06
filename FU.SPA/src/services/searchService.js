import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

/*
  params = {
    keywords: "",
  }
*/
const searchPosts = async (query) => {
  let queryString = '';
  queryString += 'keywords=' + encodeURIComponent(query.keywords);
  if (query.games.length > 0) {
    queryString += '&games=' + query.games.map((g) => String(g.id)).join(',');
  }
  if (query.tags.length > 0) {
    queryString += '&tags=' + query.tags.map((g) => String(g.id)).join(',');
  }

  const authHeader = AuthService.getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/search/posts?${queryString}`, {
    headers: {
      ...(authHeader ? { ...authHeader } : {}),
    },
  });

  return await response.json();
};

const SearchService = { searchPosts };
export default SearchService;
