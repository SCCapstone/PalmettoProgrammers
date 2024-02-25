// may end up deleting this, as it may not be needed.
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

const SortOptionService = {
    findGameByAscName,
    findGameByDscName,
};
export default SortOptionService;