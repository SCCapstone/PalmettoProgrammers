// Builds a URL query string for post searching based on input arguments
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
  if (query.startDate) {
    queryString += '&startOnOrAfterDateTime=' + query.startDate.toISOString();
  }
  if (query.endDate) {
    // Add one day to search up to the last second of the day
    // because endDate defaults to the first second of the day
    queryString +=
      '&endOnOrBeforeDateTime=' + query.endDate.add(1, 'day').toISOString();
  }
  if (query.startTime) {
    // get time from iso string
    // e.g. "2024-02-09T00:07:50.553Z" to "00:07:50"
    queryString +=
      '&startOnOrAfterTime=' +
      query.startTime.toISOString().split('T')[1].split('.')[0];
  }
  if (query.endTime) {
    queryString +=
      '&endOnOrBeforeTime=' +
      query.endTime.toISOString().split('T')[1].split('.')[0];
  }

  // Page
  if (query.page) {
    queryString += '&page=' + query.page;
  }
  // Limit
  if (query.limit) {
    // Default in the api is 20
    queryString += '&limit=' + query.limit;
  }

  // Sort option
  if (query.sort) {
    queryString += '&sort=' + query.sort;
  }

  return queryString;
};

// Builds a URL query string for user searching based on input arguments
const buildUserQueryString = (query) => {
  let queryString = '';
  if (query && query.keywords) {
    queryString += `keywords=${encodeURIComponent(query.keywords.trim())}`;
  }

  // Page
  if (query.page) {
    queryString += '&page=' + query.page;
  }
  // Limit
  if (query.limit) {
    // Default in the api is 20
    queryString += '&limit=' + query.limit;
  }

  // Sort option
  if (query.sort) {
    queryString += '&sort=' + query.sort;
  }

  return queryString;
};

const RequestBuilder = {
  buildPostQueryString,
  buildUserQueryString,
};
export default RequestBuilder;
