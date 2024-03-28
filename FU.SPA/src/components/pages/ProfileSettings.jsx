import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Stack,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import UserService from '../../services/userService';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import AvatarService from '../../services/avatarService';
import ClearIcon from '@mui/icons-material/Clear';
import { Store } from 'react-notifications-component';

export default function ProfileSettings() {
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(dayjs());
  const [newPfpUrl, setNewPfpUrl] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userInfo = await UserService.getUserprofile('current');
        setBio(userInfo.bio || '');
        setDateOfBirth(userInfo.dob ? dayjs(userInfo.dob) : null);
      } catch (error) {
        console.error('Failed to load profile info', error);
      }
    }

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const idJson = await UserService.getUserIdJson();

      // Form request payload
      const data = {
        pfpUrl: newPfpUrl,
        id: idJson.userId,
        bio: bio,
        // if the date of birth is the same as today, ignore and set as null
        // if not same day, update
        dob:
          dateOfBirth.toISOString().substring(0, 10) !==
          dayjs().toISOString().substring(0, 10)
            ? dateOfBirth.toISOString().substring(0, 10)
            : null,
      };

      await UserService.updateUserProfile(data);
      // Redirect to user profile
      navigate(0);

      // Profile notification success
      Store.addNotification({
        title: 'Profile Settings Updated',
        message: 'Your profile settings have successfully changed.',
        type: 'success',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    } catch (e) {
      // Profile notification error
      Store.addNotification({
        title: 'Error has occured',
        message: 'An error has occured. Please try again.\n' + e,
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

  const handlePreviewUrl = (imageUrl) => {
    setNewPfpUrl(imageUrl);
    console.log(imageUrl);
  };

  const clearBio = () => {
    try {
      setBio('');
    } catch (e) {
      console.error(e);
    }
  };

  // Display component
  return (
    <Container component="main" maxWidth="xs">
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
          mt: 2,
          gap: 2,
          width: 270,
        }}
      >
        <Typography variant="h5">Update Profile</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={null} // Leave null as to not change date
            fullWidth
            onChange={(newValue) => setDateOfBirth(newValue)}
          />
        </LocalizationProvider>
        <TextField
          fullWidth
          id="setBio"
          label="About"
          value={bio}
          multiline
          onChange={(e) => setBio(e.target.value)}
        />
        <UploadAvatar onNewPreview={handlePreviewUrl} />
        <Button type="submit" fullWidth variant="contained">
          Update Profile
        </Button>
      </Box>
    </Container>
  );
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadAvatar = ({ onNewPreview }) => {
  const [file, setFile] = useState();
  const [uploadedImageUrl, setUploadedImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (onNewPreview) onNewPreview(uploadedImageUrl);
  }, [onNewPreview, uploadedImageUrl]);

  const handleFileChange = async (event) => {
    event.preventDefault();
    setError();

    if (!event.target.files) {
      setFile();
      return;
    }

    setLoading(true);
    setFile(event.target.files[0]);

    try {
      const response = await AvatarService.upload(event.target.files[0]);
      setUploadedImageUrl(response.imageUrl);
    } catch (error) {
      setError(error.message);
      handleClearFile();
    }

    setLoading(false);
  };

  const handleClearFile = () => {
    setUploadedImageUrl();
    setFile();
  };

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload avatar
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
      {file && (
        <Paper variant="outlined" sx={{ padding: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ pr: 1 }}>
            <Avatar
              sx={{ width: 60, height: 60 }}
              src={
                loading
                  ? 'https://storagefu.blob.core.windows.net/icons/spinner.gif'
                  : uploadedImageUrl
              }
            />
            <Typography sx={{ flexGrow: 99, textAlign: 'left' }} noWrap>
              {file?.name}
            </Typography>
            <ClearIcon sx={{ cursor: 'pointer' }} onClick={handleClearFile} />
          </Stack>
        </Paper>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </>
  );
};
