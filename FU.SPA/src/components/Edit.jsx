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
import { useContext, useEffect, useState } from 'react';
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
import UserContext from '../context/userContext';

window.gameDetails = "";
window.tagsDetails = "";

export default function Edit({ postId }) {
  const [game, setGame] = useState();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(30, 'minute'));
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [postsDetails, setPostsDetails] = useState('');

  const { user } = useContext(UserContext);

  useEffect(() => {
    const init = async () => {
      try {
        const postDetails = await PostService.getPostDetails(postId);
        if (user.id !== postDetails.creator.id) {
          alert('You are not authorized to edit this post');
          navigate(`/discover`);
        }
        setPostsDetails(postDetails);
        setTitle(postsDetails.title);
        setDescription(postsDetails.description);
        setStartTime(dayjs(postsDetails.startTime));
        setEndTime(dayjs(postsDetails.endTime));
        gameDetails = postsDetails.game;
        tagsDetails = postDetails.tags;

        // setGame(postsDetails.game);
        // setTags(postsDetails.tags);
      } catch (e) {
        console.error(e);
      }
    };

    init();
  });

  const handleSubmit = async (e) => {
    // change to get post state, autofill fields based on info
    e.preventDefault();

    let tagIds = [];

    for (const tag of tags) {
      const newTag = await TagService.findOrCreateTagByName(tag.name);
      tagIds.push(newTag.id);
    }

    try {
      var findGame = await GameService.findOrCreateGameByTitle(game.name);
    } catch (e) {
      alert(e);
      console.error(e);
    }

    const updatedPost = {
      title: title,
      description: description,
      startTime: startTime !== null ? startTime.toISOString() : null,
      endTime: endTime !== null ? endTime.toISOString() : null,
      tagIds: tagIds,
      gameId: findGame.id,
    };

    try {
      await PostService.updatePost(updatedPost, postId);
      alert('Post updated successfully!');
      navigate(`/posts/${postId}`);
    } catch (e) {
      window.alert(e);
      console.error(e);
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
          Edit Post
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
            required
            fullWidth
            id="searchGames"
            label="Title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Grid item xs={12}>
          {postsDetails.game !== undefined && (
            <GameSelector initialValue={gameDetails} onChange={setGame} />
          )}
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
          {postsDetails.tags !== undefined &&
            (<TagsSelector initialValue={tagsDetails} onChange={setTags} />
          )}
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Typography component="h1" variant="h6">
              {' '}
              Description
            </Typography>
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
            Update Post
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

const GameSelector = ({ onChange, initialValue }) => {
  const [gameOptions, setGameOptions] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    const getGames = async () => {
      try {
        const game = await GameService.searchGames('');
        //GameService.searchGames('').then((games) => setGameOptions(games));
        setGameOptions(game);
        const gameChoice = game.find((g) => g.name === initialValue);
        if (gameChoice) {
          setValue(gameChoice);
        }
        // const gameOptions = GameService.searchGames('').then((games) => setGameOptions(games)).find((g) => g.name === initialValue);
        // if(gameOptions) {
        //   setValue(gameOptions);
        // }
      } catch (e) {
        console.error("Problem getting games", e);
      }
    };

    getGames();
  }, []);

  const onInputChange = (event, newValue) => {
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
      options={gameOptions}
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

const TagsSelector = ({ onChange, initialValue }) => {
  const [tagOptions, setTagOptions] = useState([]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const tags = await TagService.searchTags('');
        setTagOptions(tags);
        //const tags = TagService.searchTags('').then((tags) => setTagOptions(tags));
        // setTagOptions(TagService.searchTags('').then((tags) => setTagOptions(tags)));
        //if tags aren't null and isn't empty string.
        if (initialValue && initialValue.length > 0) {
          // const initialTags = TagService.searchTags('').then((tags) => setTagOptions(tags)).filter(tag => initialValue.includes(tag.name));
          const initialTags = tags.filter(tag => initialValue.includes(tag.name));
          setValue(initialTags);
        }
      } catch (e) {
        console.error("Something went wrong getting tags: ", e);
      }
    };
    getTags();
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
