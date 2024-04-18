// Note: This file is run with node not the browser. For details see https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser
// Note: This file must be self-contained, imports will fail.

console.log('Entering setup script');
const API_BASE_URL = process.env.API_BASE_URL;

let tokenStorage = {};

const signUp = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/Accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    console.log('Response Status:', response.status);
    const errorText = await response.text();
    console.error('Sign-up Error Response:', errorText);
    throw new Error(`Failed to sign up: ${errorText}`);
  }

  console.log('Sign-up successful.');
};

// sign in and retrieve a token
const signIn = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/Accounts/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed: ${errorText}`);
  }

  const data = await response.json();
  tokenStorage.token = data.token;
  console.log('Authentication successful, token obtained.');
  return data.token;
};

const postGameData = async (gameData) => {
  const token = tokenStorage.token;
  const response = await fetch(`${API_BASE_URL}/Games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(gameData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to post game data: ${errorText}`);
  }

  const result = await response.json();
  console.log('Game data inserted:', result);
};

const setup = async () => {
  console.log('setting up');
  try {
    const credentials = { username: 'user', password: 'pass', email: 'user@example.com' };
    
    await signUp(credentials);
    await signIn(credentials);
    const gameData = [
      { name: "Insurgency", id: "1" },
      { name: "RainBow Six Siege", id: "2" },
      { name: "Rocket League", id: "3" }
    ];

    for (const game of gameData) {
      await postGameData(game);
    }
  } catch (error) {
    console.error('Setup failed:', error);
  }

  console.log('Setup complete');
};

// Run the setup after a delay to give the API time to start up
setTimeout(setup, 3000);
