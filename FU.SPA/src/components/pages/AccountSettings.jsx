import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { useState } from 'react';
import UserService from '../../services/userService';
import { useNavigate } from 'react-router';
import UserContext from '../../context/userContext';
import { useContext } from 'react';

export default function AccountSettings() {
  const { user, logout } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Error checking common cases
    console.log(oldPassword);
    console.log(newPassword);
    console.log(confirmPassword);

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    } else if (newPassword !== '' && oldPassword === '') {
      alert('Old password must be supplied when updating password');
      return;
    }

    try {
      // Make request and attempt to fetch API
      const data = {
        username: username !== null ? username : null,
        oldPassword: oldPassword !== null ? oldPassword : null,
        newPassword: newPassword !== null ? newPassword : null,
      };

      await UserService.updateAccountInfo(data);
      alert('Info updated successfully!\nYou will be logged out.');
      localStorage.clear();
      logout();
      navigate('/signin');
      // Not the best way to do this but it'll do for now
      //const idJson = await UserService.getUserIdJson();
      //navigate('/profile/' + idJson.userId);
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };

  // Display component
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Account Settings
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 1,
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            id="setUsername"
            label="New Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            id="oldPassword"
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            fullWidth
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            autoComplete="new-password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Information
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
