import {
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Checkbox,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PostService from '../../services/postService';
import TagService from '../../services/tagService';
import GameService from '../../services/gameService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PostCard from '../PostCard';
import UserContext from '../../context/userContext';

export default function CreatePost() {
  const { user } = useContext(UserContext);
  const [game, setGame] = useState(null);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(dayjs().add(5, 'minute'));
  const [endTime, setEndTime] = useState(dayjs().add(15, 'minute'));
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const [gameError, setGameError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');

  const [isEnabled, setIsEnabled] = useState(false);

  // Checks for the length and appropriate constrictions
  useEffect(() => {
    if (
      title.length >= 3 &&
      game?.name.length >= 3 &&
      game !== null &&
      game !== '' &&
      game.name !== null &&
      game.name !== '' &&
      startTime !== null &&
      endTime !== null &&
      startTime.isAfter(dayjs()) &&
      startTime.isBefore(endTime) &&
      endTime.isBefore(dayjs().add(24, 'hours')) &&
      endTime.isAfter(startTime)
    ) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [title, game, isEnabled, endTime, startTime]);

  // Handles title state error
  const handleTitleChange = (e) => {
    if (e.target.value < 3) {
      setTitleError('Title must be longer than 3 characters');
      setTitle(e.target.value);
    } else {
      setTitle(e.target.value);
      setTitleError('');
    }
  };

  // Handles game state error
  const handleGameChange = (e) => {
    if (e === null || e.length === 0) {
      setGameError('Game must be longer than 3 characters');
      setGame(e);
      setIsEnabled(false);
    } else if (e.length < 3) {
      setGameError('Game must be longer than 3 characters');
      setGame(e);
      setIsEnabled(false);
    } else {
      setGameError('');
      setGame(e);
      setIsEnabled(true);
    }
  };

  // Handles start date state error
  const handleStartDateChange = (e) => {
    if (e === null) {
      setStartDateError('Time cannot be empty');
      setStartTime(e);
    } else if (e.isBefore(dayjs())) {
      setStartDateError('Time cannot be before current time');
      setStartTime(e);
    } else if (e.isAfter(endTime)) {
      setStartDateError('Time cannot be after end time');
      setStartTime(e);
    } else {
      setStartDateError('');
      setStartTime(e);
    }
  };

  // Handles end date state error
  const handleEndDateChange = (e) => {
    if (e === null) {
      setEndDateError('Time cannot be empty');
      setEndTime(e);
    } else if (e.isAfter(dayjs().add(24, 'hours'))) {
      setEndDateError('Time cannot exceed 24 hours');
      setEndTime(e);
    } else if (e.isBefore(startTime)) {
      setEndDateError('Time cannot be before start time');
      setEndTime(e);
    } else {
      setEndDateError('');
      setEndTime(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tagIds = [];

    // Gets tags from API or creates them
    for (const tag of tags) {
      const newTag = await TagService.findOrCreateTagByName(tag.name);
      tagIds.push(newTag.id);
    }

    // Gets game from API or creates it
    var findGame = await GameService.findOrCreateGameByTitle(game.name);

    // Form payload
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
      window.alert(e);
      console.error(e);
    }
  };

  const getTagsForPreview = () => {
    if (tags.length === 0) {
      return ['Tag1', 'Tag2'];
    }

    return tags.map((tag) => tag.name);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        paddingRight: '10%',
      }}
    >
      <div style={{ alignContent: 'center' }}>
        <PostCard
          post={{
            creator: user,
            game: game?.name ?? 'Game Name',
            title: title.length > 0 ? title : 'Post Title',
            description:
              description.length > 0 ? description : 'Post Description',
            startTime: startTime,
            endTime: endTime,
            tags: getTagsForPreview(),
          }}
          showActions={false}
        />
      </div>
      <Box
        sx={{
          marginTop: 1,
          m: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 'fit-content',
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
            mt: 0,
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            error={title?.length < 3}
            id="searchGames"
            helperText={titleError}
            minLength={3}
            maxLength={25}
            label="Title *"
            autoFocus
            value={title}
            onChange={handleTitleChange}
          />
          <Grid item xs={0}>
            <GameSelector
              onChange={handleGameChange}
              helperText={gameError}
              error={game?.length < 3}
            />
          </Grid>
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Time"
              value={startTime}
              onChange={handleStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    startTime === null ||
                    startTime.isBefore(dayjs()) ||
                    startTime.isAfter(endTime),
                  helperText: startDateError,
                },
              }}
            />
            <DateTimePicker
              label="End Time"
              value={endTime}
              helperText={endDateError}
              onChange={handleEndDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    endTime === null ||
                    endTime.isAfter(dayjs().add(24, 'hours')) ||
                    endTime.isBefore(startTime),
                  helperText: endDateError,
                },
              }}
            />
          </LocalizationProvider>
          <TagsSelector onChange={setTags} />
          <Box
            sx={{
              display: 'flex',
            }}
          ></Box>
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
            sx={{ mt: 0, mb: 0 }}
            disabled={!isEnabled}
          >
            Create Post
          </Button>
        </Box>
      </Box>
    </div>
  );
}

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

// Game selector that displays a drop down and lets you choose a game
// or create one
const GameSelector = ({ onChange }) => {
  const [gameOptions, setGameOptions] = useState([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGameOptions = async () => {
      try {
        GameService.searchGames('').then((games) => setGameOptions(games));
        GameService.searchGames('').then((games) => setGameOptions(games));
      } catch (err) {
        console.error(err);
      }
    };
    fetchGameOptions();
  }, []);

  const onInputChange = (event, newValue) => {
    try {
      setValue(newValue);
      if (newValue && newValue.name && newValue.name.length < 3) {
        setError(true);
      } else {
        setError(false);
      }
      onChange(newValue);
    } catch (err) {
      setError(true);
    }
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
      autoHighlight
      clearOnBlur
      value={value}
      onChange={onInputChange}
      options={gameOptions}
      filterOptions={onFilterOptions}
      getOptionLabel={(o) => (o ? o.name : '')}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          error={error}
          label="Game *"
          minLength={3}
          maxLength={25}
          helperText={
            error || value === null ? 'Must be at least 3 characters' : ''
          }
        />
      )}
    />
  );
};

// Tag selector that displays a drop down and lets you choose a tag
// or create one
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
      autoHighlight
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
