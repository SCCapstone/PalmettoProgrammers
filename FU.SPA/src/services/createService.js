import config from "../config";
const API_BASE_URL = config.API_URL;
const LOCAL_STORAGE_TOKEN_KEY = 'token';

// Create post request
const createPost = async () => {
  const response = await fetch(`${API_BASE_URL}/Posts`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    throw new Error('Error in post creation');
  }
  const jsonResponse = await response.json();

  console.log(jsonResponse);
}

const CreateService = { createPost };
export default CreateService;