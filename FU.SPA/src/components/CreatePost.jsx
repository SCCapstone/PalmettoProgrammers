import * as React from 'react';
import {
  Button,
  TextField,
  Link,
  Box,
  Container,
  Typography,
  CssBaseline,
  Avatar,
  FormControlLabel,
  Icon,
  Grid,
  Checkbox,
} from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';

// TODO remove, this demo shouldn't need to reset the theme.

//const defaultTheme = createTheme();

//Look at changing to const CreatePost = () => {
//    CreatingPost();
//} or something similiar.
//Design of the page.

function CreatePost() {
  // going to use in another function for clicking
  return (
    <ThemeProvider theme={createTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
          }}
        ></Box>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Create
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  marginLeft: 2,
                }}
              >
                <Typography component="h1" variant="h6">
                  Game (Post Title)
                </Typography>
              </Box>
              <Grid item xs={12}>
                <TextField
                  required //may want to get rid of this and just check if it's empty when clicking create button.
                  fullWidth
                  id="searchGames"
                  label="Search Games" //might want to put a Search icon in front, if we can figure it out.
                  type="searchGames"
                  name="searchGames"
                  autofocus
                />
              </Grid>
              <Box
                sx={{
                  marginTop: 3,
                  display: 'flex',
                  marginLeft: 2,
                  marginRight: 2.5,
                }}
              >
                <Typography component="h1" variant="h6">
                  Time:
                </Typography>
              </Box>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="startTime"
                  fullWidth
                  id="startTime"
                  label="Start Time"
                />
              </Grid>
              <Box
                sx={{
                  marginLeft: 2,
                  marginTop: 3,
                  display: 'flex',
                }}
              >
                <Typography component="h1" variant="h6">
                  and
                </Typography>
              </Box>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="endTime"
                  label="End Time"
                  name="endTime"
                />
              </Grid>
              <Box
                sx={{
                  marginTop: 3,
                  display: 'flex',
                  marginLeft: 2,
                  marginRight: 2.5,
                }}
              >
                <Typography component="h1" variant="h6">
                  Communication
                </Typography>
              </Box>{' '}
              {/* Need to place radius buttons under the Communication */}
              <Grid item xs={12} sm={5} marginTop={2}>
                <label>Any</label>
                <Radio>Any</Radio>
                <label>Mic</label>
                <Radio>Mic</Radio>
                <label>No Mic</label>
                <Radio>No Mic</Radio>
              </Grid>
              <Box
                sx={{
                  marginTop: 3,
                  display: 'flex',
                  marginLeft: 2,
                  marginRight: 2.5,
                }}
              >
                <Typography component="h1" variant="h6">
                  Hashtags
                </Typography>
              </Box>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="searchHashtags"
                  label="Search Hashtags"
                  name="searchHashtags"
                  autoComplete="searchHashtags"
                />{' '}
                {/* Need to put checkboxes under the hashtag section, which will display*/}
              </Grid>
              <Box
                sx={{
                  marginTop: 3,
                  display: 'flex',
                  marginLeft: 2,
                  marginRight: 2.5,
                }}
              >
                <Typography component="h1" variant="h6">
                  {' '}
                  {/* Need to have 2 radius buttons below for 'Any' and 'Between' */}
                  Number of Players Needed
                </Typography>
              </Box>
              <Grid item xs={12} sm={4}>
                {/* Might set default value to 1*/}
                <TextField
                  name="minNum"
                  fullWidth
                  id="minNum"
                  label="Min Number"
                />
              </Grid>
              <Box
                sx={{
                  marginLeft: 2,
                  marginTop: 3,
                  display: 'flex',
                }}
              >
                <Typography component="h1" variant="h6">
                  and
                </Typography>
              </Box>
              <Grid item xs={12} sm={4}>
                {/* Might set default value to 3*/}
                <TextField
                  fullWidth
                  id="maxNum"
                  label="Max Number"
                  name="maxNum"
                />
              </Grid>
              <Box
                sx={{
                  marginTop: 3,
                  display: 'flex',
                  marginLeft: 2,
                  marginRight: 2.5,
                }}
              >
                <Typography component="h1" variant="h6">
                  {' '}
                  {/* Need to have 2 radius buttons below for 'Any' and 'Between' */}
                  Description
                </Typography>
              </Box>
              <Grid item xs={12} sm={6} marginTop={2}>
                <TextareaAutosize aria-setsize={300}></TextareaAutosize>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Post
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
//removed brace here
