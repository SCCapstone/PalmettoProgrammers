const API_BASE_URL = import.meta.env.VITE_API_URL;


/*
  params = {
    keywords: "",
  }
*/
const searchGames = async (keyword) => {
  const response = await fetch(`${API_BASE_URL}/games?$keyword=${keyword}`);

  return await response.json();
};

const GameService = { searchGames };
export default GameService;
