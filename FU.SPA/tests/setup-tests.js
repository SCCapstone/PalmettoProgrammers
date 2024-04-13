// Note: This file is run with node not the browser. For details see https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser
// Note: This file must be self-contained, imports will fail.

console.log('Entering setup script');
const API_BASE_URL = process.env.API_BASE_URL;

const setup = async () => {
  console.log('Setting up');
  const gameData = {
    name: "Insurgency",
    id: "1"
  };
  try {
    const response = await fetch(`${API_BASE_URL}/Games`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });
    const result = await response.json();
    console.log('Data inserted:', result);
  } catch (error) {
    console.error('Failed to insert data:', error);
  }

  console.log('Setup done');
};

// Run setup after 3 second delay to give api time to startup
setTimeout(setup, 3000);
