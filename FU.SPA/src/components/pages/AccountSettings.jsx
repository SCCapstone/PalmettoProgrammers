import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';
import UserService from '../../services/userService';
import { useNavigate } from 'react-router';
import UserContext from '../../context/userContext';
import { useContext } from 'react';
import { Store } from 'react-notifications-component';

export default function AccountSettings() {
  const { logout, user } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changeEmailDialogOpen, setChangeEmailDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Error checking common cases
    if (newPassword !== confirmPassword) {
      // Passwords not matching notification
      Store.addNotification({
        title: 'Password Error',
        message: 'Passwords must match',
        type: 'danger',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      return;
    } else if (newPassword !== '' && oldPassword === '') {
      // Old password missing notification
      Store.addNotification({
        title: 'Password Error',
        message: 'Old password must be supplied when updating password',
        type: 'danger',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
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
        alertMessage += '\nYou have been logged out.';
      }
      // Info update notification
      Store.addNotification({
        title: 'Info Updated',
        message: alertMessage,
        type: 'success',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
      // redirect to signin & logout if password was changed
      if (data.newPassword !== null) {
        localStorage.clear();
        logout();
        navigate('/signin');
      }
    } catch (e) {
      // Error notification
      Store.addNotification({
        title: 'Error has occured',
        message: 'An error has occured.\n' + e,
        type: 'danger',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
      console.error(e);
    }
  };

  /**
   * The dialog to confirm the deletion of the account
   * We want to ensure that the user is sure they want to delete their account
   * We don't want to accidentally delete an account
   *
   * @returns The dialog to confirm the deletion of the account
   */
  const DeleteAccountDialog = () => {
    const [password, setPassword] = useState('');
    const [credentialsError, setCredentialsError] = useState('');

    const handleClose = () => {
      setDeleteDialogOpen(false);
    };

    const handleDelete = async () => {
      var creds = {
        username: user.username,
        password: password,
      };
      try {
        await UserService.deleteAccount(creds);
        setDeleteDialogOpen(false);
        // logout and navigate to the home page
        localStorage.clear();
        logout();
        navigate('/');
        Store.addNotification({
          title: 'Account Deletion Confirmation',
          message: 'Your account has been successfully deleted.',
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
        setCredentialsError('Incorrect credentails');
        console.error('Error in deleting account', event);
      }
    };

    // Returns a Dialog that displays the delete action confirmation
    return (
      <Dialog open={deleteDialogOpen} onClose={handleClose}>
        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible and will revoke all access to your
            account.
          </DialogContentText>
          <TextField
            autoFocus
            error={!!credentialsError}
            helperText={credentialsError}
            margin="dense"
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
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
    };

    const handleEmailChange = (e) => {
      const newEmail = e.target.value;
      setEmail(newEmail);
      if (newEmail.trim() === '') {
        setEmailError('');
      }
    };

    const handleSubmit = async () => {
      try {
        const data = {
          newEmail: email,
        };
        await UserService.updateAccountInfo(data);
        setChangeEmailDialogOpen(false);
        // logout and navigate to the home page
        localStorage.clear();
        logout();
        navigate('/');
        Store.addNotification({
          title: 'Email Change Confirmation',
          message:
            'Your email has been successfully changed. Please reconfirm your account using the new email.',
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
        const errorResponse = await JSON.parse(event.message);
        setEmailError(errorResponse.detail);
        console.error('Error in changing email', event.message);
      }
    };

    // Component details
    return (
      <Dialog open={changeEmailDialogOpen} onClose={handleClose}>
        <DialogTitle>Email Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please note that updating your email will automatically log you out
            and require reconfirmation of your account using the new email
            address. Are you sure you wish to proceed?
          </DialogContentText>
          <TextField
            autoFocus
            error={!!emailError}
            helperText={emailError}
            margin="dense"
            id="changeEmail"
            label="Change Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Change Email
          </Button>
        </DialogActions>
      </Dialog>
    );
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '90vh',
            justifyContent: 'space-between',
          }}
        >
          <div>
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
              <ChangeEmailDialog />
              <Button
                className="change-email-button"
                variant="contained"
                onClick={() => setChangeEmailDialogOpen(true)}
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                Change Email
              </Button>
            </Box>
          </div>
          <Button
            className="delete-button"
            variant="contained"
            color="error"
            onClick={() => {
              setDeleteDialogOpen(true);
            }}
            sx={{
              mt: 3,
              mb: 2,
              // position: 'absolute',
              // bottom: '0',
            }}
          >
            Delete Account
          </Button>
          <DeleteAccountDialog />
        </div>
      </Box>
    </Container>
  );
}
