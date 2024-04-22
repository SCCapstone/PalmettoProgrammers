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

  // Error checking
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

  // Error checking
  if (!response.ok) {
    // Get the error message
    const errorText = await response.text();
    throw new Error(errorText || 'Error in sign up');
  }
};

// Function for email account confirmation
const confirmAccount = async (token) => {
  const response = await fetch(`${API_BASE_URL}/Accounts/confirm`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Error checking
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error in confirming account');
  }

  const jsonResponse = await response.json();
  return jsonResponse;
};

// Function for resending confirmation email
const resendConfirmation = async (resendConfirmationData) => {
  const response = await fetch(`${API_BASE_URL}/Accounts/resendconfirmation`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(resendConfirmationData),
  });

  // Error checking
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error in resending confirmation');
  }
};

// Function that retrieves users' auth token from localStorage
const getToken = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  return token;
};

// Function that gets a logged in users account token and easily formats it
// for API calls
const getAuthHeader = () => {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
};

const AuthService = {
  signIn,
  signUp,
  getAuthHeader,
  confirmAccount,
  resendConfirmation,
};
export default AuthService;
