import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

/*
  params = {
    keywords: "",
  }
*/
const searchGames = async (keyword) => {
  keyword = encodeURIComponent(keyword);
  const response = await fetch(`${API_BASE_URL}/games?keyword=${keyword}`);

  return await response.json();
};

// Finds a game by its title
const findGameByTitle = async (title) => {
  let games = await searchGames(title);

  let game = null;

  for (const g of games) {
    // compare ignoring case
    if (g.name.toLowerCase() === title.toLowerCase()) game = g;
  }

  return game;
};

// Finds a game by title, and if it doesn't exist, creates the game
const findOrCreateGameByTitle = async (title) => {
  let game = await findGameByTitle(title);

  // Creates a game if it does not exist
  if (!game) {
    game = await createGame({ Name: title });
  }

  return game;
};

// Create game request
const createGame = async (params) => {
  const response = await fetch(`${API_BASE_URL}/Games`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(params),
  });

  // Error checking
  if (!response.ok) {
    throw new Error('Error in game creation');
  }
  return await response.json();
};

const GameService = {
  searchGames,
  createGame,
  findOrCreateGameByTitle,
  findGameByTitle,
};
export default GameService;
