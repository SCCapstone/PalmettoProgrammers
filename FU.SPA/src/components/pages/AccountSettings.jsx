import { Container, Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useState } from 'react';
import UserService from '../../services/userService';
import { useNavigate } from 'react-router';
import UserContext from '../../context/userContext';
import { useContext } from 'react';


export default function AccountSettings() {
  const { logout } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeEmailDialogOpen, setChangeEmailDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Error checking common cases
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
        username: username !== '' ? username : null,
        oldPassword: oldPassword !== '' ? oldPassword : null,
        newPassword: newPassword !== '' ? newPassword : null,
      };

      await UserService.updateAccountInfo(data);
      let alertMessage = 'Info updated successfully!';
      if (data.newPassword !== null) {
        alertMessage += '\nYou will be logged out.';
      }
      alert(alertMessage);
      if (data.newPassword !== null) {
        localStorage.clear();
        logout();
        navigate('/signin');
      }
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };

  /***
   * Dialog to change email
   * We want to ensure that the user is sure they want to change their email
   * TODO: look into password verification
   * 
   * @returns The dialog to confirm the email change
   */
  const ChangeEmailDialog = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleClose = () => {
      setChangeEmailDialogOpen(false);
    }

    const handleEmailChange = async () => {
      try {
        const data = {
          email: email
        }
        console.log(data);
        await UserService.updateAccountInfo(data);
      } catch (e) {
        setEmailError(e);
        console.error('Error in changing email', e);
      }
    }

    // Component details
    return (
      <Dialog open={changeEmailDialogOpen} onClose={handleClose}>
        <DialogTitle>Email Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will change the email of your account. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <TextField
            autoFocus
            error={!!emailError}
            helperText={emailError}
            margin="dense"
            id="changeEmail"
            label="Change Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEmailChange} autoFocus>Change Email</Button>
        </DialogActions>
      </Dialog>
    )
  }

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
        <Button
          className="change-email-button"
          variant="contained error"
          onClick={() => setChangeEmailDialogOpen(true)}
          sx ={{
            mt:3,
            mb: 2,
            position: 'absolute',
            bottom: '0',
            backgroundColor: 'red',
            '&:hover': {
              backgroundColor: 'darkred'
            },
          }}
        >
          Change Email
        </Button>
        <ChangeEmailDialog />
      </Box>
    </Container>
  );
}
