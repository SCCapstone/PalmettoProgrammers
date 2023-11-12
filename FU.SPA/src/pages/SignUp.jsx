import * as React from 'react';
import { Button, TextField, Link, Box, Container, Typography, CssBaseline, Avatar, FormControlLabel, Icon, Grid, Checkbox } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Replace with logo eventually
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import { signUp } from '../services/auth-service';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const creds = { username: data.get('username'), password: data.get('password') };
    // Passing sign up info to API
    signUp(creds).then(response => {
      // console.log(response);
    });
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
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs = {12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  type="username"
                  name="username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs ={12} sm = {4}>
                <TextField 
                  required
                  fullWidth
                  name="ageDay"
                  label="Day"
                  type="ageDay"
                  id="ageDay"
                />
              </Grid>
              <Grid item xs ={12} sm = {4}>
                <TextField 
                  required
                  fullWidth
                  name="ageMonth"
                  label="Month"
                  type="ageMonth"
                  id="ageMonth"
                />
              </Grid>
              <Grid item xs ={12} sm = {4}>
                <TextField 
                  required
                  fullWidth
                  name="ageYear"
                  label="Year"
                  type="ageYear"
                  id="ageYear"
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
                <Link href="#" variant="body2">
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
