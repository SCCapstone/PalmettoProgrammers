import * as React from 'react';
import { Button, TextField, Link, Box, Container, Typography, CssBaseline, Avatar, FormControlLabel, Icon, Grid, Checkbox } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

/*
 * Thinking of making this a nav unit to go to the CreatePost page.
 * The nav bar would go to Create Post first, then would go to the CreateGroup
 * section of the Create page, when it has been clicked on.
 */
// function CreatePost() { //This should be a redirect/nav button or just be a label, so as not to reset values in textfields.
//   const handleCreatePost = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       //data to be collected from user
//     });
//   }
// };

function CreateGroup() { //This should be a redirect/nav button or just be a label, so as not to reset values in textfields.
  const handleCreatePost = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      //data to be collected from user
    });
  }
};
function RadioButtonsGroup() {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Communications</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue=""
        name="radio-buttons-group"
      >
        <FormControlLabel value="Mic" control={<Radio />} label="Mic" />
        <FormControlLabel value="No Mic" control={<Radio />} label="No Mic" />
        <FormControlLabel value="Any" control={<Radio />} label="Any" />
      </RadioGroup>
    </FormControl>
  );
}

function deselectCommunicationRadio() {};

function CheckboxLabels() { //Might change how the page is designed and use the function to show checkboxes
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
      <FormControlLabel required control={<Checkbox />} label="Required" />
      <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
    </FormGroup>
  );
}
//Create button click
export default function Create() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get(''), //change to get information from the post data
      password: data.get(''),
    });
  };

function createGroupButton() {
  const handleCreateGroup = (event) => {
    event.preventDefault();
    createGroup();
  }
}

//TODO create buttons on the left side of the page, which will then be used inside the creategroup and createpost functions

// TODO START OF PAGE CODE, WHICH I'M CHANGING TO CREATE GROUP, BEFORE MAKING IT A BUTTON FUNCTION (semi-completed)
function createGroup() {
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
        >

        </Box>
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
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Box
              sx={{
                display: 'flex',
                marginLeft: 2,
              }}>
              <Typography component="h1" variant="h6">
                Group Name
              </Typography>
              </Box>
              <Grid item xs = {12}>
                <TextField
                  required //may want to get rid of this and just check if it's empty when clicking create button.
                  fullWidth
                  id="groupName"
                  label="Name here" //might want to put a Search icon in front, if we can figure it out.
                  type="groupName"
                  name="groupName"
                  autofocus
                />
              </Grid>

              <Box
              sx={{
                marginTop: 3,
                display: 'flex',
                marginLeft: 2,
                marginRight: 2.5,
              }}>
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
              }}>
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
              }}>
              <Typography component="h1" variant="h6"> 
                Communication
              </Typography>
              </Box> {/* Need to place radius buttons under the Communication */}
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
              }}>
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
                /> {/* Need to put checkboxes under the hashtag section, which will display*/}
              </Grid>
              <Box
              sx={{
                marginTop: 3,
                display: 'flex',
                marginLeft: 2,
                marginRight: 2.5,
              }}>
              <Typography component="h1" variant="h6"> {/* Need to have 2 radius buttons below for 'Any' and 'Between' */}
                Description
              </Typography>
              </Box>
              <Grid item xs={12} sm={6} marginTop={2}>
                <TextareaAutosize aria-setsize={300}>
                </TextareaAutosize>
              </Grid>
            </Grid>
            <Box
              sx={{
                marginTop: 3,
                display: 'flex',
                marginRight: 2.5,
              }}>
              <Typography component="h1" variant="h6"> {/* Need to have 2 radius buttons below for 'Any' and 'Between' */}
              Favorite Games
              </Typography>
              </Box>
              <Grid item xs={12} sm={6} marginTop={2}>
              <TextField
                  fullWidth
                  id="FavoriteGames"
                  label="Search games" //might want to put a Search icon in front, if we can figure it out.
                  type="FavoriteGames"
                  name="FavoriteGames"
                  autofocus
                />
              </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Group
            </Button>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
  );
  }
}

function createPostButton() {
  const handleCreatePost = (event) => {
    event.preventDefault();
    createPost();
  }
}

//Design of the page
function CreatePost() { // going to use in another function for clicking
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
            >

            </Box>
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
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    marginLeft: 2,
                  }}>
                  <Typography component="h1" variant="h6">
                    Game (Post Title)
                  </Typography>
                  </Box>
                  <Grid item xs = {12}>
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
                  }}>
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
                  }}>
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
                  }}>
                  <Typography component="h1" variant="h6"> 
                    Communication
                  </Typography>
                  </Box> {/* Need to place radius buttons under the Communication */}
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
                  }}>
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
                    /> {/* Need to put checkboxes under the hashtag section, which will display*/}
                  </Grid>

                  <Box
                  sx={{
                    marginTop: 3,
                    display: 'flex',
                    marginLeft: 2,
                    marginRight: 2.5,
                  }}>
                  <Typography component="h1" variant="h6"> {/* Need to have 2 radius buttons below for 'Any' and 'Between' */}
                    Number of Players Needed
                  </Typography>
                  </Box>
                  <Grid item xs={12} sm={4}>{/* Might set default value to 1*/}
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
                  }}>
                  <Typography component="h1" variant="h6">
                    and
                  </Typography>
                  </Box>
                  <Grid item xs={12} sm={4}>{/* Might set default value to 3*/}
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
                  }}>
                  <Typography component="h1" variant="h6"> {/* Need to have 2 radius buttons below for 'Any' and 'Between' */}
                    Description
                  </Typography>
                  </Box>
                  <Grid item xs={12} sm={6} marginTop={2}>
                    <TextareaAutosize aria-setsize={300}>
                    </TextareaAutosize>
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