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
import CreatePost from '../CreatePost.jsx';
import { useEffect, useState } from 'react';
import CreateGroup from '../CreateGroup.jsx';
import "./create.css";

// TODO remove, this demo shouldn't need to reset the theme.

//const defaultTheme = createTheme();



export default function Create() {
  // function handleSubmit(event) {
  //   event.preventDefault();
  //   <CreatePost />
  // }
  const [currentTab, setCurrentTab] = useState('posts'); // posts && groups for now and later maybe players, depending on how we 
  const [posts, setPost] = useState([]);
  const [groups, setGroups] = useState([]);

const renderTabContent = () => {
  if (currentTab === 'posts') {
    return <CreatePost />;
  } else if (currentTab === 'groups') {
    return <CreateGroup />;
  } else {
    return <p><b>Players hasn't been set up yet</b></p>;
  }
}

  return (<>
  <div className='container'>
    <div className='leftContent'>
              <Button
                onClick={() => 
                  //alert("This is a test")
                  setCurrentTab('posts')
                  //CreatePost();
                  //<CreatePost />
                }
                //alignItems="left"
                type="submit"
                variant="contained"
                //sx={{ mt: 2, mb: 0 }}
              >
                Create Post
              </Button>
              <Button
                onClick={() => 
                  setCurrentTab('groups')
                }
                //alignItems="left"
                type="submit"
                variant="contained"
                //sx={{ mt: 0, mb: 2 }}
              >
                Create Group
              </Button>
              </div> 
    <div className='rightContent'>
    <ThemeProvider theme={createTheme}>
      <Container component="main" maxWidth="xs" className='main'>
        <CssBaseline />          
          {renderTabContent()}
      </Container>
    </ThemeProvider>
    </div>
    </div>
    </>
  );
}


// function CreateGroupButton() {
//   //This should be a redirect/nav button or just be a label, 
//   //so as not to reset values in textfields.
//   const handleCreateGroup = (event) => {
//     event.preventDefault();
//     CreateGroup();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       //data to be collected from user
//     });
//   };
// }

// function CreatePostButton() {

// }

// function deselectCommunicationRadio() {}

// function CheckboxLabels() {
//   //Might change how the page is designed and use the function to show checkboxes
//   return (
//     <FormGroup>
//       <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
//       <FormControlLabel required control={<Checkbox />} label="Required" />
//       <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
//     </FormGroup>
//   );
// }