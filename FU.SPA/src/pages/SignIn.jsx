import {
  Button,
  TextField,
  Link,
  Box,
  Container,
  Typography,
  CssBaseline,
  Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Replace with logo eventually
import { signIn } from '../services/auth-service';

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    var creds = {
      username: data.get('username'),
      password: data.get('password'),
    };
    // Calls sign in and saves token in local storage
    signIn(creds).then((response) => {
      // console.log('Sign in response', response);
      localStorage.setItem('token', response['token']);
    });
  };

  // Creates and returns signin form
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in to Forces Unite
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Username Text Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="email" // Didn't see an autocomplete prop for username, leaving as email, should function the same
            autoFocus
          />
          {/* Password Text Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Link href="#" variant="body2">
            Sign Up
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
