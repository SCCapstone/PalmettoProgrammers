import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

const searchAscDsc = async (keyword) => {
    keyword = encodeURIComponent(keyword);
    const response = await fetch(`${API_BASE_URL}/ascDsc?$keyword=${keyword}`);

    return await response.json();
};

const findGameByAscName = async (name) => {
    let games = await searchGames(title);
    console.log(tags);
  
    let game = null;
  
    for (const g of games) {
        if (g.name.toLowerCase() === title.toLowerCase()) game = g;
    }
    game.sort();

    return game;
};

const findGameByDscName = async (name) => {
    let games = await searchGames(title);
    console.log(tags);
  
    let game = null;
  
    for (const g of games) {
        if (g.name.toLowerCase() === title.toLowerCase()) game = g;
    }
    game.sort(); //need to sort before you reverse the order.
    game.reverse();

    return game;
};

const twoChoices = async (choice) => {
    let choices = {"A-Z" : "Z-A"};
    // if (choice.toLowerCase === "a-z") {
    //     choices = "A-Z";
    // } else if (choice.toLowerCase === "z-a") {
    //     choices = "Z-A";
    // }

    return choices;
};

const AscDscService = {
    findGameByAscName,
    findGameByDscName,
    searchAscDsc,
    twoChoices
}
export default AscDscService;