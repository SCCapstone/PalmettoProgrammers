const API_BASE_URL = import.meta.env.VITE_API_URL;


/*
  params = {
    keywords: "",
  }
*/
const searchPosts = async (query) => {
  let queryString = "";
  queryString += "keywords=" + encodeURIComponent(query.keywords);
  const response = await fetch(`${API_BASE_URL}/search/posts?${queryString}`);

  return await response.json();
};

const SearchService = { searchPosts };
export default SearchService;
