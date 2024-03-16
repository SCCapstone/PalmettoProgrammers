import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import UserService from '../../services/userService';
// import { TagsSelector, GamesSelector } from "../Selectors";
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router';

export default function ProfileSettings() {
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(dayjs());
  const [pfpUrl, setPfpUrl] = useState('');
  // const [favoriteGames, setFavoriteGames] = useState([]);
  // const [favoriteTags, setFavoriteTags] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const idJson = await UserService.getUserIdJson();

      // Form request payload
      const data = {
        id: idJson.userId,
        pfpUrl: pfpUrl !== '' ? pfpUrl : null,
        bio: bio !== '' ? bio : null,
        // if the date of birth is the same as today, ignore and set as null
        // if not same day, update
        dob:
          dateOfBirth.toISOString().substring(0, 10) !==
          dayjs().toISOString().substring(0, 10)
            ? dateOfBirth.toISOString().substring(0, 10)
            : null,
        //favoriteGames: favoriteGames,
        //favoriteTags: favoriteTags
      };

      await UserService.updateUserProfile(data);
      alert('Info updated successfully!');

      // Redirect to user profile
      navigate('/profile/' + idJson.userId);
    } catch (e) {
      alert(e);
      console.error(e);
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
            mt: 1,
            gap: 2,
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
          <br />
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
            id="setPfpUrl"
            label="Update Profile Picture (Insert link)"
            value={pfpUrl}
            onChange={(e) => setPfpUrl(e.target.value)}
          />
          {/* TODO(epadams) make this work once the backend gets fixed
            <GamesSelector
              onChange={(e) => setFavoriteGames(e.target.value)}
            />
            <TagsSelector
              onChange={(e) => setFavoriteTags(e.target.value)}
            />
            */}
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
