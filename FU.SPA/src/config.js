const config = {
  API_URL:
    window.location.hostname === 'jolly-glacier-0ae92c40f.4.azurestaticapps.net'
      ? 'https://fuapi.azurewebsites.net/api'
      : import.meta.env.VITE_API_URL,
  CHAT_HUB_URL:
    window.location.hostname === 'jolly-glacier-0ae92c40f.4.azurestaticapps.net'
      ? 'https://fuapi.azurewebsites.net/chathub'
      : import.meta.env.VITE_API_URL.replace(/\/api$/, '') + '/chathub',
  WAIT_TIME:
    import.meta.env.VITE_WAIT_TIME !== undefined
      ? import.meta.env.VITE_WAIT_TIME
      : 80,
  POST_SORT_OPTIONS: [
    { value: 'newest', label: 'Created Date' },
    { value: 'soonest', label: 'Start Time' },
    { value: 'title', label: 'Title' },
  ],
};

export default config;