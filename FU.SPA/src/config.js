const config = {
  API_URL:
    window.location.hostname === 'jolly-glacier-0ae92c40f.4.azurestaticapps.net'
      ? 'https://fuapi.azurewebsites.net/api'
      : import.meta.env.VITE_API_URL,
};

export default config;
