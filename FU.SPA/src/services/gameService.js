import config from '../config';
const API_BASE_URL = config.API_URL;
import { authService } from './authService'

/*
  params = {
    keywords: "",
  }
*/
const searchGames = async (keyword) => {
  const response = await fetch(`${API_BASE_URL}/games?$keyword=${keyword}`);

  return await response.json();
};

// Create game request
const createGame = async (params) => {
  const response = await fetch(`${API_BASE_URL}/Games`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error in game creation');
  }
  const jsonResponse = await response.json();

  console.log(jsonResponse);
};

const GameService = { searchGames, createGame };
export default GameService;
