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

  return queryString;
};

const buildUserQueryString = (query) => {
  let queryString = '';
  if (query.keywords) {
    queryString += `keywords=${encodeURIComponent(query.keywords.trim())}`;
  }

  return queryString;
};

const buildUpdateAccountInfo = (username, oldPassword, newPassword) => {
  var request = {};
  if (username !== null) {
    request.username = username;
  }
  if (oldPass !== null) {
    request.oldPassword = oldPassword;
  }
  if (newPass !== null) {
    request.newPassword = newPassword;
  }

  return request;
} 

const RequestBuilder = { buildPostQueryString, buildUserQueryString, buildUpdateAccountInfo };
export default RequestBuilder;
