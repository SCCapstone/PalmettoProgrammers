import {
  Button,
  TextField,
  Box,
  Container,
  Typography,
  Grid,
  Autocomplete,
  Checkbox,
} from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useEffect, useState } from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PostService from '../services/postService';
import TagService from '../services/tagService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function CreatePost() {
  const [game, setGame] = useState('');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = {
      title: title,
      description: description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      tagIds: [],
      gameId: 1,
    };

    await PostService.createPost(post);
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
          Create Post
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <TextField
              required //may want to get rid of this and just check if it's empty when clicking create button.
              fullWidth
              id="searchGames"
              label="Title" //might want to put a Search icon in front, if we can figure it out.
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              required //may want to get rid of this and just check if it's empty when clicking create button.
              fullWidth
              id="searchGames"
              label="Game" //might want to put a Search icon in front, if we can figure it out.
              type="searchGames"
              name="searchGames"
              value={game}
              onChange={(e) => setGame(e.target.value)}
            />
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
              />
              <DateTimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
              />
            </LocalizationProvider>
            <Grid item xs={12}>
              <TagsSelector />
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
              <TextareaAutosize
                aria-setsize={300}
                size={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></TextareaAutosize>
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
  );
}

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;

const TagsSelector = ({ onChange }) => {
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    TagService.searchTags('').then((tags) => setTagOptions(tags));
  }, []);

  const onInputChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setValue({
        title: newValue,
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setValue({
        title: newValue.inputValue,
      });
    } else {
      setValue(newValue);
    }
  };

  return (
    <Autocomplete
      multiple
      onChange={onChange}
      options={tagOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={checkboxIconBlank}
            checkedIcon={checkboxIconChecked}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Tags" placeholder="" />
      )}
    />
  );
};
