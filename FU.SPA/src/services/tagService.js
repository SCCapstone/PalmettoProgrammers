const API_BASE_URL = import.meta.env.VITE_API_URL;

/*
  params = {
    keywords: "",
  }
*/
const searchTags = async (keyword) => {
  const response = await fetch(`${API_BASE_URL}/tags?$keyword=${keyword}`);

  return await response.json();
};

const TagService = { searchTags };
export default TagService;
