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
  queryString += 'keywords=' + encodeURIComponent(query.keywords.trim());
  if (query.games.length > 0) {
    queryString += '&games=' + query.games.map((g) => String(g.id)).join(',');
  }
  if (query.tags.length > 0) {
    queryString += '&tags=' + query.tags.map((g) => String(g.id)).join(',');
  }

  if (query.startDate) {
    // get date from iso string
    // e.g. "2024-02-09T00:07:50.553Z" to "2024-02-09"
    queryString += '&startOnOrAfterDate=' + query.startDate.toISOString().split('T')[0];
  }
  if (query.endDate) {
    queryString += '&endOnOrBeforeDate=' + query.endDate.toISOString().split('T')[0];
  }
  if (query.startTime) {
    // get time from iso string
    // e.g. "2024-02-09T00:07:50.553Z" to "00:07:50"
    queryString +=
      '&startOnOrAfterTime=' + query.startTime.toISOString().split('T')[1].split('.')[0];
  }
  if (query.endTime) {
    queryString +=
      '&endOnOrBeforeTime=' + query.endTime.toISOString().split('T')[1].split('.')[0];
  }

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
