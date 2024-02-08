// Logic

// Create post query string
const buildPostQueryString = (query) => {
  let queryString = '';
  if (query.keywords) {
    queryString += 'keywords=' + encodeURIComponent(query.keywords?.trim());
  }
  if (query.games?.length > 0) {
    queryString += '&games=' + query.games.map((g) => String(g.id)).join(',');
  }
  if (query.tags?.length > 0) {
    queryString += '&tags=' + query.tags.map((g) => String(g.id)).join(',');
  }
  console.log(queryString)
  return queryString;
};

const StringBuilderService = { buildPostQueryString };
export default StringBuilderService;
