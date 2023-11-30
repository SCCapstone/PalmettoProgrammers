const API_BASE_URL = import.meta.env.VITE_API_URL;

const searchPosts = async () => {
    const response = await fetch(`${API_BASE_URL}/search/posts`);

    if (!response.ok) {
        throw new Error("Error fetching posts");
    }

    return await response.json();
};

const SearchService = { searchPosts };
export default SearchService;
