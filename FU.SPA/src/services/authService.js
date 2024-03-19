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
    const errorText = await response.text();
    throw new Error(errorText || 'Error in sign in');
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
    // Get the error message
    const errorText = await response.text();
    throw new Error(errorText || 'Error in sign up');
  }
};

const confirmAccount = async(token) => {
  console.log('confirmAccount', token);
  const response = await fetch(`${API_BASE_URL}/Accounts/confirm`, {
    method: 'POST',
    headers: {
      ...AuthService.getAuthHeader(),
    },
  });  

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error in confirming account');
  }

  const jsonResponse = await response.json();
  return jsonResponse;
};

const resendConfirmation = async(email) => {
  const response = await fetch(`${API_BASE_URL}/Accounts/reconfirm/${email}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error in resending confirmation');
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

const AuthService = { signIn, signUp, getAuthHeader, confirmAccount, resendConfirmation };
export default AuthService;
