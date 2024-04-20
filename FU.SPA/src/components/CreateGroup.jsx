// NOTE: unused component and deprecated
import {
  Button,
  TextField,
  Box,
  Container,
  Typography,
  CssBaseline,
  Grid,
} from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';

export default function CreateGroup() {
  return (
    <ThemeProvider theme={createTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Create Group
          </Typography>
          <Box
            component="form"
            noValidate
            //onSubmit={handleSubmit}
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
                  Group Name
                </Typography>
              </Box>
              <Grid item xs={12}>
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
              <Grid item xs={12} sm={9} marginTop={2}>
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
                  Description
                </Typography>
              </Box>
              <Grid item xs={12} sm={6} marginTop={2}>
                <TextareaAutosize aria-setsize={300}></TextareaAutosize>
              </Grid>
            </Grid>
            <Box
              sx={{
                marginTop: 3,
                display: 'flex',
                marginRight: 2.5,
              }}
            >
              <Typography component="h1" variant="h6">
                {' '}
                {/* Need to have 2 radius buttons below for 'Any' and 'Between' */}
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
