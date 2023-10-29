import * as React from 'react';
import { Button, TextField, Link, Box, Container, Typography, CssBaseline} from '@mui/material';

export default function SignIn() {
    /* Debugging only, this will change to pass auth details when endpoint is
       finished */
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
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
                    alignItems: 'center'
                }}>
                <Typography component="h1" variant="h5">Sign in to Forces Unite
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1}}>
                    {/* Email Text Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                        sx={{ mt: 3, mb: 2}}
                    >
                    Sign In
                    </Button>
                    <Link href="#" variant="body2">Sign Up</Link>
                </Box>
            </Box>
        </Container>
    );
};