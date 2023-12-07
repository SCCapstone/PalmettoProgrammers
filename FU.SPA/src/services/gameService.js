import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

/*
  params = {
    keywords: "",
  }
*/
const searchGames = async (keyword) => {
  keyword = encodeURIComponent(keyword)
  const response = await fetch(`${API_BASE_URL}/games?keyword=${keyword}`);

  return await response.json();
};

const findGameByTitle = async (title) => {
  let games = await searchGames(title);

  let game = null;

  for (const g of games) {
    if (g.name == title) game = g
  }

  return game;
}

const findOrCreateGameByTitle = async (title) => {
  let game = await findGameByTitle(title)

  if (!game) {
    game = await createGame({ Name: title })
  }

  return game
}

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

  if (!response.ok) {
    throw new Error('Error in game creation');
  }
  return await response.json();
};

const GameService = { searchGames, createGame, findOrCreateGameByTitle, findGameByTitle };
export default GameService;
