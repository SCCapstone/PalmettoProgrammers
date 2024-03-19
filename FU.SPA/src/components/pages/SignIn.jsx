import {
  Button,
  Link,
  Box,
  Container,
  Typography,
  CssBaseline,
  Avatar,
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Replace with logo eventually
import AuthService from '../../services/authService';
import UserContext from '../../context/userContext';
import { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Store } from 'react-notifications-component';
import Theme from '../../Theme';

export default function SignIn() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  /* We use a generic "credentials error" as a way to obfuscate wheter
   * username or password is incorrect, i.e. cannot try and find if a username
   * already exists for an account, must go through signup for that
   * this also helps if the website would ever change to emails for login
   * to prevent checking if the email has been used to signup
   */
  const [credentialsError, setCredentialsError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [unconfirmedAccountDialogOpen, setUnconfirmedAccountDialogOpen] =
    useState(false);

  // Display password when eye icon is clicked
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  var returnUrl = searchParams.get('returnUrl');
  var signUpLink = returnUrl
    ? `/SignUp?returnUrl=${encodeURIComponent(returnUrl)}`
    : '/SignUp';

  const isEnabled = username.length > 0 && password.length > 0;

  // Update state for username
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setCredentialsError('');
  };

  // Update state for password
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setCredentialsError('');
  };

  // Function is called when 'Login' is pressed
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create login query payload
    var creds = {
      username: username,
      password: password,
    };

    try {
      const response = await AuthService.signIn(creds);
      login(response.token);
      navigate(returnUrl ?? '/');
    } catch (event) {
      const errorResponse = await JSON.parse(event.message);
      if (errorResponse && errorResponse.detail === 'Account not confirmed') {
        setCredentialsError('Account not yet verified');
        setUnconfirmedAccountDialogOpen(true);
      } else {
        setCredentialsError('Incorrect credentails');
      }
      console.error('Error in sign in:', event);
    }
  };

  /**
   * The unconfirmed account dialog
   * When a user signs in and their account is not confirmed, this dialog will appear
   * It gives users the option to resend the confirmation email with a button
   * 
   * @returns The dialog
   */
  const UnconfirmedAccountDialog = () => {
    const handleClose = () => {
      setUnconfirmedAccountDialogOpen(false);
    };

    const handleSend = async () => {
      try {
        var creds = {
          username: username,
          password: password,
          reconfirmAccount: true,
        };
        await AuthService.signIn(creds);
        Store.addNotification({
          title: 'Email Sent',
          message:
            'A new confirmation email has been sent. Please check your email.',
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
        Store.addNotification({
          title: 'Email Not Sent',
          message:
            'There was an error sending the confirmation email. Please try again later.',
          type: 'danger',
          insert: 'top',
          container: 'top-center',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            onScreen: true,
          },
        });
      }

      setUnconfirmedAccountDialogOpen(false);
    };

    return (
      <Dialog open={unconfirmedAccountDialogOpen} onClose={handleClose}>
        <DialogTitle>
          Your account has not been confirmed. Please check your email for a
          confirmation link.
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Or click the button below to resend the confirmation email.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSend} autoFocus>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Creates and returns signin form
  return (
    <>
      <UnconfirmedAccountDialog />
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* Username Text Field */}
            <TextField
              error={!!credentialsError}
              helperText={credentialsError}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="email" // Didn't see an autocomplete prop for username, leaving as email, should function the same
              autoFocus
              onChange={handleUsernameChange}
            />
            {/* Password Text Field */}
            <TextField
              error={!!credentialsError}
              helperText={credentialsError}
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              onChange={handlePasswordChange}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isEnabled}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Link
              class="signup-link"
              onClick={() => navigate(signUpLink)}
              variant="body2"
              style={{
                color: Theme.palette.primary.main,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Sign Up
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
}
