import { Container, Box, Typography, Grid, TextField, Button } from "@mui/material";
import { useState } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

export default function ProfileSettings () {

    {/*
      * Required Fields:
      * pfpurl
      * bio
      * date of birth
      * username
      * favorite games
      * favorite tags
      */}
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(dayjs());
  const [pfpUrl, setPfpUrl] = useState('');

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
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <TextField
              fullWidth
              id="setUsername"
              label="Update Username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
                value={dateOfBirth}
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
          </Grid>
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