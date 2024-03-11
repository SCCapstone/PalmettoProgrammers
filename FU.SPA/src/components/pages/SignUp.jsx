import {
  Button,
  Link,
  Box,
  Container,
  Typography,
  CssBaseline,
  Avatar,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Replace with logo eventually
import { Label, Visibility, VisibilityOff } from '@mui/icons-material';
import AuthService from '../../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Showing passwords when user wants
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Update state for each field
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordError('');
  };

  // Check if all fields are filled
  const isEnabled =
    username.length > 0 && password.length > 0 && confirmPassword.length > 0;

  // Function called when button is pressed
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const creds = {
      username: data.get('username'),
      password: data.get('password'),
    };

    // Checking if passwords are identical
    if (creds.password !== data.get('confirmPassword')) {
      setPasswordError('Passwords do not match');
      return;
    }

    // This try/catch block will attempt to sign the user up, check for any
    // errors in signup, and redirect to signin/last page if there are no errors
    try {
      await AuthService.signUp(creds);
      setSignUpSuccess(true);
      var returnUrl = searchParams.get('returnUrl');
      if (returnUrl !== null && returnUrl !== '') {
        navigate(`/SignIn?returnUrl=${encodeURIComponent(returnUrl)}`);
      } else {
        setSignUpSuccess(true);
      }
    } catch (event) {
      // Parse the error message
      const errorResponse = JSON.parse(event.message);

      //If username already exists
      if (errorResponse && errorResponse.title === 'Duplicate User') {
        setUsernameError(errorResponse.detail);
      } // Check if there is a specific error message for Username
      else if (
        errorResponse &&
        errorResponse.errors &&
        errorResponse.errors.Username
      ) {
        setUsernameError(errorResponse.errors.Username[0]);
      } else {
        // Handles other general errors
        setUsernameError('An unexpected error occurred. Please try again.');
      }
      console.error('Error in sign up:', errorResponse);
    }
  };

  // Display component
  return (
    <>
      {
        signUpSuccess ? ( //if signup was successful
          <Grid>
            <Typography component="h1" variant="h5">
              Sign Up Successful!
            </Typography>
            <Link href="/SignIn">Sign In</Link>
          </Grid>
        ) : (
          ''
        ) //if signup was not successful
      }
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={!!usernameError}
                  helperText={usernameError}
                  onChange={handleUsernameChange}
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  type="username"
                  name="username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!passwordError}
                  helperText={passwordError}
                  onChange={handlePasswordChange}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!passwordError}
                  helperText={passwordError}
                  onChange={handleConfirmPasswordChange}
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isEnabled}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/SignIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
