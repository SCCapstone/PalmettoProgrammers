import {
  Button,
  TextField,
  Box,
  Container,
  Typography,
  Grid,
  Checkbox,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PostService from '../services/postService';
import TagService from '../services/tagService';
import GameService from '../services/gameService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function CreatePost() {
  const [game, setGame] = useState(null);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(30, 'minute'));
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tagIds = [];

    for (const tag of tags) {
      const newTag = await TagService.findOrCreateTagByName(tag.name);
      tagIds.push(newTag.id);
    }

    var findGame = await GameService.findOrCreateGameByTitle(game.name);

    const post = {
      title: title,
      description: description,
      startTime: startTime !== null ? startTime.toISOString() : null,
      endTime: endTime !== null ? endTime.toISOString() : null,
      tagIds: tagIds,
      gameId: findGame.id,
    };

    try {
      const newPost = await PostService.createPost(post);
      navigate(`/posts/${newPost.id}`);
    } catch (e) {
      window.alert('Error creating post');
      console.log(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 1,
          m: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create Post
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
            mt: 3,
            gap: 2,
          }}
        >
          <TextField
            required //may want to get rid of this and just check if it's empty when clicking create button.
            fullWidth
            id="searchGames"
            label="Title" //might want to put a Search icon in front, if we can figure it out.
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Grid item xs={12}>
            <GameSelector onChange={setGame} />
          </Grid>
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
          <TagsSelector onChange={setTags} />
          <Box
            sx={{
              display: 'flex',
            }}
          >
          </Box>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
          ></TextField>

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
const filter = createFilterOptions();

const GameSelector = ({ onChange }) => {
  const [gammeOptions, setGameOptions] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    GameService.searchGames('').then((games) => setGameOptions(games));
  }, []);

  const onInputChange = (event, newValue) => {
    console.log('newValue');
    console.log(newValue);

    setValue(newValue);
    onChange(newValue);
  };

  const onFilterOptions = (options, params) => {
    const filtered = filter(options, params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.name);
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        // inputValue,
        id: null,
        name: inputValue,
      });
    }

    return filtered;
  };

  return (
    <Autocomplete
      clearOnBlur
      value={value}
      onChange={onInputChange}
      options={gammeOptions}
      disableCloseOnSelect
      filterOptions={onFilterOptions}
      getOptionLabel={(o) => (o ? o.name : '')}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Game"
          required
          placeholder="Select or create a game"
        />
      )}
    />
  );
};

const TagsSelector = ({ onChange }) => {
  const [tagOptions, setTagOptions] = useState([]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    TagService.searchTags('').then((tags) => setTagOptions(tags));
  }, []);

  const onInputChange = (event, newValues) => {
    for (const newValue of newValues) {
      if (newValue.id === null) {
        // if not in options add to options
        if (!tagOptions.some((o) => o.name === newValue.name)) {
          const newOptions = tagOptions.concat([newValue]);
          setTagOptions(newOptions);
        }
      }
    }

    setValue(newValues);
    onChange(newValues);
  };

  const onFilterOptions = (options, params) => {
    const filtered = filter(options, params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.name);
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        // inputValue,
        id: null,
        name: inputValue,
      });
    }

    return filtered;
  };

  return (
    <Autocomplete
      multiple
      clearOnBlur
      value={value}
      onChange={onInputChange}
      options={tagOptions}
      disableCloseOnSelect
      filterOptions={onFilterOptions}
      getOptionLabel={(o) => o.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
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
