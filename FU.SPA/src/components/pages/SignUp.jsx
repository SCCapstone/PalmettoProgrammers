import {
  Button,
  Link,
  Box,
  Container,
  Typography,
  CssBaseline,
  Avatar,
  Grid,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Replace with logo eventually
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthService from '../../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CustomTextField } from '../../helpers/styleComponents';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const creds = {
      username: data.get('username'),
      password: data.get('password'),
    };

    if (creds.password !== data.get('confirmPassword')) {
      alert('Passwords do not match');
      return;
    }

    AuthService.signUp(creds);
    var returnUrl = searchParams.get('returnUrl');
    if (returnUrl !== null && returnUrl !== '') {
      navigate(`/SignIn?returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      navigate('/SignIn');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
                <CustomTextField
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
                <CustomTextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
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
    </ThemeProvider>
  );
}
