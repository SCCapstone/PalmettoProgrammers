import * as React from 'react';
import { Button, TextField, Link, Box, Container, Typography, CssBaseline, Avatar, FormControlLabel, Icon, Grid, Checkbox } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
//import {CreatePost} from '../components/CreatePost';
//import {CreateGroup} from '../components/CreateGroup';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

function CreateGroupButton() { //This should be a redirect/nav button or just be a label, so as not to reset values in textfields.
  const handleCreatePost = (event) => {
    event.preventDefault();
    CreateGroup();
    const data = new FormData(event.currentTarget);
    console.log({
      //data to be collected from user
    });
  }
};


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

export default function Create() {
  return (
    //<h1>Create</h1>
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
          <Grid item xs={12} sm={5} marginTop={2}>
              <h1>Create</h1>
              <Button
              alignItems="left"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 0 }}
            >
              Create Post
            </Button>
            <Button
              alignItems="left"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 0, mb: 2 }}
            >
              Create Group
            </Button>
          </Grid>
        </Container>
      </ThemeProvider>
  );
}