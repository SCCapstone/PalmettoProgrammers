// Array of possible sort options for posts
const POST_SORT_OPTIONS = [
  { value: 'newest', label: 'Created Date' },
  { value: 'soonest', label: 'Start Time' },
  { value: 'title', label: 'Title' },
];

// Array of possible sort options for posts in the Social component
const SOCIAL_POST_SORT_OPTIONS = [
  ...POST_SORT_OPTIONS,
  { value: 'chatactivity', label: 'Chat Activity' },
];

// Array of possible sort options for users in the Discover component
const USER_SORT_OPTIONS = [
  { value: 'username', label: 'Name' },
  { value: 'dob', label: 'DOB' },
];

// Array of possible sort options for users in the Social component
const SOCIAL_USER_SORT_OPTIONS = [
  ...USER_SORT_OPTIONS,
  { value: 'chatactivity', label: 'Chat Activity' },
];

/* Exports config variables and arrays
 * If running locally, will use the local running API, otherwise used the hosted
 * API
 */
const config = {
  API_URL:
    window.location.hostname === 'jolly-glacier-0ae92c40f.4.azurestaticapps.net'
      ? 'https://fuapi.azurewebsites.net/api'
      : window.location.hostname === 'forces-unite.com'
        ? 'https://fuapi.azurewebsites.net/api'
        : import.meta.env.VITE_API_URL || 'https://fuapi.azurewebsites.net/api',
  CHAT_HUB_URL:
    window.location.hostname === 'jolly-glacier-0ae92c40f.4.azurestaticapps.net'
      ? 'https://fuapi.azurewebsites.net/chathub'
      : window.location.hostname === 'forces-unite.com'
        ? 'https://fuapi.azurewebsites.net/chathub'
        : (
            import.meta.env.VITE_API_URL ||
            'https://fuapi.azurewebsites.net/api'
          ).replace(/\/api$/, '') + '/chathub',
  WAIT_TIME:
    import.meta.env.VITE_WAIT_TIME !== undefined
      ? import.meta.env.VITE_WAIT_TIME
      : 80,
  POST_SORT_OPTIONS: POST_SORT_OPTIONS,
  SOCIAL_POST_SORT_OPTIONS: SOCIAL_POST_SORT_OPTIONS,
  USER_SORT_OPTIONS: USER_SORT_OPTIONS,
  SOCIAL_USER_SORT_OPTIONS: SOCIAL_USER_SORT_OPTIONS,
};

export default config;
