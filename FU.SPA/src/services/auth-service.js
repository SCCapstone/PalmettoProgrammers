const API_BASE_URL = "http://localhost:5278/api";

// Sign in, passes username and password to API
export const signIn = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/Accounts/auth`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(credentials),
  });

  
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error in sign in");
  }
};

// Sign up, passes username and password to API
export const signUp = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/Accounts`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error in sign up");
  }
};