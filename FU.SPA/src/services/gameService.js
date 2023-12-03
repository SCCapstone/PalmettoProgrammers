import config from "../config";
const API_BASE_URL = config.API_URL;

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
