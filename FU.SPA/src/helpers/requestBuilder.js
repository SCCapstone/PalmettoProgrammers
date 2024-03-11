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

  // Update from DateAndTimeFilter Branch
  if (query.startDate) {
    // get date from iso string
    // e.g. "2024-02-09T00:07:50.553Z" to "2024-02-09"
    queryString +=
      '&startOnOrAfterDate=' + query.startDate.toISOString().split('T')[0];
  }
  if (query.endDate) {
    queryString +=
      '&endOnOrBeforeDate=' + query.endDate.toISOString().split('T')[0];
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
    // subtract 1 from page number to make it 0-indexed
    queryString += '&offset=' + (query.page - 1);
  }
  // Limit
  if (query.limit) {
    // Default in the api is 20
    queryString += '&limit=' + query.limit;
  }

  return queryString;
};

const buildUserQueryString = (query) => {
  let queryString = '';
  if (query.keywords) {
    queryString += `keywords=${encodeURIComponent(query.keywords.trim())}`;
  }

  // Page
  if (query.page) {
    // subtract 1 from page number to make it 0-indexed
    queryString += '&offset=' + (query.page - 1);
  }
  // Limit
  if (query.limit) {
    // Default in the api is 20
    queryString += '&limit=' + query.limit;
  }

  return queryString;
};

const RequestBuilder = {
  buildPostQueryString,
  buildUserQueryString,
};
export default RequestBuilder;
