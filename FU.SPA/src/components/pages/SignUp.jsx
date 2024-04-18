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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Replace with logo eventually
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthService from '../../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Store } from 'react-notifications-component';
import Theme from '../../Theme';

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedReadTerms, setConfirmedReadTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Showing passwords when user wants
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Update state for username
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
  };

  // Update state for email
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError('');
  };

  // Update state for password
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  // Check if all fields are filled
  const isEnabled =
    username.length > 0 &&
    email.length > 0 &&
    password.length >= 8 &&
    confirmedReadTerms;

  // Function called when button is pressed
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const creds = {
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
    };

    // This try/catch block will attempt to sign the user up, check for any
    // errors in signup, and redirect to signin/last page if there are no errors
    try {
      await AuthService.signUp(creds);
      var returnUrl = searchParams.get('returnUrl');
      if (returnUrl !== null && returnUrl !== '') {
        navigate(`/SignIn?returnUrl=${encodeURIComponent(returnUrl)}`);
      } else {
        navigate('/SignIn');
      }
      //Display SignUp success
      Store.addNotification({
        title: 'Account Signup Confirmation',
        message:
          'Your account has been successfully created! Please check your email to verify your account.',
        type: 'success',
        insert: 'top',
        container: 'top-center',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    } catch (event) {
      // Parse the error message
      const errorResponse = JSON.parse(event.message);

      //If username already exists
      if (errorResponse?.title === 'Duplicate User') {
        setUsernameError(errorResponse.detail);
      } // Check if there is a specific error message for Username
      else if (errorResponse?.errors?.Username) {
        setUsernameError(errorResponse.errors.Username[0]);
      } else if (errorResponse?.status === 409) {
        // Duplicate email
        setEmailError(errorResponse.detail);
      } else if (errorResponse?.status === 400) {
        // bad password
        setPasswordError(errorResponse.detail);
      } else if (errorResponse?.errors?.Email) {
        setEmailError(errorResponse.errors.Email[0]);
      } else {
        // Handles other general errors
        setUsernameError('An unexpected error occurred. Please try again.');
      }
      console.error('Error in sign up:', errorResponse);
    }
  };

  // Display component
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                error={!!emailError}
                helperText={emailError}
                onChange={handleEmailChange}
                required
                fullWidth
                id="email"
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!!passwordError}
                helperText={
                  passwordError ||
                  'Password must be 8 characters long and contain either 1 special character or number'
                }
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
          </Grid>
          <Grid item sx={{ mt: 1 }}>
            <ConfirmedCheckbox
              name="agreeTerms"
              label="terms and conditions"
              link="https://www.termsofusegenerator.net/live.php?token=l9sB7PUlIGU397WXEeCPZXSM90sEXn02"
              checked={confirmedReadTerms}
              onChange={(event) => setConfirmedReadTerms(event.target.checked)}
              description="I agree to the"
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isEnabled}
            sx={{ mt: 1, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container direction="column" alignItems="flex-end">
            <Grid item>
              <Link
                className="signin-link"
                onClick={() => navigate(`/SignIn`)}
                variant="body2"
                style={{
                  color: Theme.palette.primary.main,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
  function ConfirmedCheckbox({
    name,
    label,
    link,
    checked,
    onChange,
    description,
  }) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            name={name}
            color="primary"
            size="extra small"
            checked={checked}
            onChange={onChange}
            style={{ padding: 5 }}
          />
        }
        label={
          <span>
            <Typography
              component="span"
              variant="body2"
              style={{
                color: Theme.palette.primary.main,
                marginRight: 3,
              }}
            >
              {description}
            </Typography>
            <Link
              href={link}
              variant="body2"
              target="_blank"
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
                color: Theme.palette.primary.main,
              }}
            >
              {label}
            </Link>
          </span>
        }
        style={{ marginRight: 0 }}
      />
    );
  }
}
