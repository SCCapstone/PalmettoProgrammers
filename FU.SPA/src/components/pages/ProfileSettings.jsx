import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Stack,
  Paper,
} from '@mui/material';
import { useState } from 'react';
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

export default function ProfileSettings() {
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(dayjs());
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const idJson = await UserService.getUserIdJson();

      // Form request payload
      const data = {
        id: idJson.userId,
        bio: bio !== '' ? bio : null,
        // if the date of birth is the same as today, ignore and set as null
        // if not same day, update
        dob:
          dateOfBirth.toISOString().substring(0, 10) !==
          dayjs().toISOString().substring(0, 10)
            ? dateOfBirth.toISOString().substring(0, 10)
            : null,
      };

      const response = await UserService.updateUserProfile(data);
      console.log(response);
      alert('Info updated successfully!');

      // Redirect to user profile
      navigate('/profile/' + idJson.userId);
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Profile Settings
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
            mt: 2,
            gap: 2,
            width: 270,
          }}
        >
          <TextField
            fullWidth
            id="setBio"
            label="Update Bio"
            value={bio}
            multiline
            onChange={(e) => setBio(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={null} // Leave null as to not change date
              fullWidth
              onChange={(newValue) => setDateOfBirth(newValue)}
            />
          </LocalizationProvider>
          <UploadAvatar />
          <Button type="submit" fullWidth variant="contained">
            Update Profile
          </Button>
        </Box>
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

const UploadAvatar = () => {
  const [file, setFile] = useState();
  const [uploadedImageId, setUploadedAvatarId] = useState();
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    event.preventDefault();

    if (!event.target.files) {
      setFile();
      return;
    }

    setLoading(true);
    setFile(event.target.files[0]);

    const response = await AvatarService.upload(event.target.files[0]);

    setUploadedAvatarId(response.id);
    setLoading(false);
  };

  const handleClearFile = () => {
    setUploadedAvatarId();
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
              src={loading ? null : AvatarService.getUrl(uploadedImageId)}
            />
            <Typography sx={{ flexGrow: 99, textAlign: 'left' }} noWrap>
              {file?.name}
            </Typography>
            <ClearIcon sx={{ cursor: 'pointer' }} onClick={handleClearFile} />
          </Stack>
        </Paper>
      )}
    </>
  );
};
