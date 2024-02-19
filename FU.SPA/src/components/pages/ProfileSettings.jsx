import { Container, Box, Typography, Button } from "@mui/material";
import { useState } from 'react';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import UserService from '../../services/userService'
import { TagsSelector, GamesSelector } from "../Selectors";
import { CustomTextField, CustomDatePicker } from "../../helpers/styleComponents";

export default function ProfileSettings () {

    {/*
      * Possible Fields:
      * pfpurl
      * bio
      * date of birth
      * favorite games
      * favorite tags
      */}

  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(dayjs());
  const [pfpUrl, setPfpUrl] = useState('');
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [favoriteTags, setFavoriteTags] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      var idJson = await UserService.getUserId();

      //console.log(favoriteGames);
      //console.log(favoriteTags);

      const data = {
        id: idJson.userId,
        pfpUrl: pfpUrl,
        bio: bio,
        dob: dateOfBirth !== null ? dateOfBirth.toISOString().substring(0, 10) : null,
        favoriteGames: favoriteGames,
        favoriteTags: favoriteTags
      };

      await UserService.updateUserProfile(data);
    } catch (e) {
      console.log(e);
    }

  };

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
          sx={{ mt: 3 }}
        >
            <CustomTextField
              fullWidth
              id="setBio"
              label="Update Bio"
              value={bio}
              multiline
              onChange={(e) => setBio(e.target.value)}
            />
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <CustomDatePicker
                label="Date of Birth"
                value={null} // Leave null as to not change date
                fullWidth
                onChange={(newValue) => setDateOfBirth(newValue)}
              />
            </LocalizationProvider>
            <CustomTextField
              fullWidth
              id="setPfpUrl"
              label="Update Profile Picture (Insert link)"
              value={pfpUrl}
              onChange={(e) => setPfpUrl(e.target.value)}
            />
            <TagsSelector
              onChange={setFavoriteTags}
            />
            <GamesSelector
              onChange={setFavoriteGames}
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
  )
}