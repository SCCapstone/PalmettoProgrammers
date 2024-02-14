import {
  Button,
  Link,
  Box,
  Container,
  Typography,
  CssBaseline,
  Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Replace with logo eventually
import AuthService from '../../services/authService';
import UserContext from '../../context/userContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomTextField } from '../../helpers/styleComponents';

export default function SignIn() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    var creds = {
      username: data.get('username'),
      password: data.get('password'),
    };

    try {
      const response = await AuthService.signIn(creds);
      login(response.token);
      navigate('/');
    } catch {
      window.alert('Error signing in');
    }
  };

  // Creates and returns signin form
  return (
    <Container component="main" maxWidth="xs" height="100%">
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
        <Typography component="h1" variant="h5" style={{ color: '#FFF' }}>
          Sign in to Forces Unite
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Username Text Field */}
          <CustomTextField
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
          <CustomTextField
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
