// Note: This file is run with node not the browser. For details see https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser
// Note: This file must be self-contained, imports will fail.

console.log('Entering setup script');
const API_BASE_URL = process.env.API_BASE_URL;

let tokenStorage = {};

const signUp = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/Accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
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
    body: JSON.stringify(credentials),
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
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to post game data: ${errorText}`);
  }

  const result = await response.json();
  console.log('Game data inserted:', result);
};

const postTagData = async (tagData) => {
  const token = tokenStorage.token;
  const response = await fetch(`${API_BASE_URL}/Tags`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tagData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to post tag data: ${errorText}`);
  }

  const result = await response.json();
  console.log('Tag data inserted:', result);
};

const createPost = async (postData) => {
  const token = tokenStorage.token;

  if (postData.StartTime && postData.EndTime) {
    postData.StartTime = new Date(postData.StartTime).toISOString();
    postData.EndTime = new Date(postData.EndTime).toISOString();
  } else {
    console.error('Invalid or missing date fields');
    throw new Error('Invalid or missing date fields');
  }

  const response = await fetch(`${API_BASE_URL}/Posts`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to create post data: ${errorText}`);
    throw new Error(`Failed to create post data: ${errorText}`);
  }

  const result = await response.json();
  console.log('post data inserted:', result);
};

const setup = async () => {
  console.log('setting up');
  try {
    const numberOfUsers = 25;

    const credentials = Array.from({ length: numberOfUsers }, (v, i) => ({
      username: `user${i + 1}`,
      password: `password${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    for (const user of credentials) {
      await signUp(user);
    }
    for (const user of credentials) {
      await signIn(user);
    }
    const gameData = [
      { name: 'Insurgency', id: '1' },
      { name: 'RainBow Six Siege', id: '2' },
      { name: 'Rocket League', id: '3' },
      { name: 'Call of Duty', id: '4' },
      { name: 'Counter Strike 2', id: '5' },
    ];

    const tagData = [
      { name: 'mic', id: '1' },
      { name: 'fun', id: '2' },
      { name: 'casual', id: '3' },
      { name: 'east', id: '4' },
      { name: 'open', id: '5' },
    ];

    const NewPostData = (index) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();

      const month =
        Math.floor(Math.random() * (12 - currentMonth + 1)) + currentMonth;

      let day;
      if (month === currentMonth) {
        day = Math.floor(Math.random() * (28 - currentDay)) + currentDay + 1;
      } else {
        day = Math.floor(Math.random() * 28) + 1;
      }

      const hourStart = Math.floor(Math.random() * 5) + 16;
      const hourEnd = hourStart + Math.floor(Math.random() * 3) + 1;

      return {
        Title: `Exciting Game Night ${index}`,
        Description: `Join us for an exciting night of gaming at event ${index}!`,
        GameId: (index % 5) + 1,
        StartTime: `${currentYear}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}T${hourStart.toString().padStart(2, '0')}:00:00`,
        EndTime: `${currentYear}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}T${hourEnd.toString().padStart(2, '0')}:00:00`,
        MaxPlayers: 10 + (index % 10),
        TagIds: [(index % 5) + 1, ((index + 1) % 5) + 1, ((index + 2) % 5) + 1],
      };
    };

    for (const game of gameData) {
      await postGameData(game);
    }

    for (const tag of tagData) {
      await postTagData(tag);
    }

    // Function to post all generated posts
    const AllGeneratedPosts = async () => {
      for (let i = 0; i < 48; i++) {
        const postData = NewPostData(i + 1);
        try {
          await createPost(postData);
          console.log(`Post ${i + 1} created successfully.`);
        } catch (error) {
          console.error(`Failed to create post ${i + 1}:`, error);
        }
      }
    };

    AllGeneratedPosts();
  } catch (error) {
    console.error('Setup failed:', error);
  }

  console.log('Setup complete');
};

// Run the setup after a delay to give the API time to start up
setTimeout(setup, 3000);
