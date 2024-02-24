import config from '../config';
const API_BASE_URL = config.API_URL;
const LOCAL_STORAGE_TOKEN_KEY = 'token';

// Sign in, passes username and password to API
const signIn = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/Accounts/auth`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Error in sign in');
  }

  const jsonResponse = await response.json();

  // Store token in local storage
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, jsonResponse.token);

  return jsonResponse;
};

// Sign up, passes username and password to API
const signUp = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/Accounts`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Error in sign up');
  }
};

const getToken = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  return token;
};

const getAuthHeader = () => {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
};

const AuthService = { signIn, signUp, getAuthHeader };
export default AuthService;
