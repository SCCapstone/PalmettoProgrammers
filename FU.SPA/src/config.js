const config = {
  API_URL:
    window.location.hostname === 'jolly-glacier-0ae92c40f.4.azurestaticapps.net'
      ? 'https://fuapi.azurewebsites.net/api'
      : import.meta.env.VITE_API_URL,
  CHAT_HUB_URL:
    window.location.hostname === 'jolly-glacier-0ae92c40f.4.azurestaticapps.net'
      ? 'https://fuapi.azurewebsites.net/chathub'
      : import.meta.env.VITE_API_URL.replace(/\/api$/, '') + '/chathub',
  WAIT_TIME: import.meta.env.VITE_WAIT_TIME !== undefined ? import.meta.env.VITE_WAIT_TIME : 80
};

console.log(import.meta.env.VITE_WAIT_TIME);
export default config;
