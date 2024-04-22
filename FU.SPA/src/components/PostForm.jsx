import {
  Button,
  TextField,
  Box,
  Checkbox,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState, useContext } from 'react';
import PostCard from './PostCard';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TagService from '../services/tagService';
import GameService from '../services/gameService';
import UserContext from '../context/userContext';
import dayjs from 'dayjs';
import { Store } from 'react-notifications-component';

// Function that displays a post form when creating or editing posts
const PostForm = ({ onSubmit, submitButtonText, initialValue }) => {
  const { user } = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(dayjs().add(5, 'minute'));
  const [endTime, setEndTime] = useState(dayjs().add(15, 'minute'));
  const [description, setDescription] = useState('');
  const [game, setGame] = useState(null);
  const [tags, setTags] = useState([]);

  const [isEnabled, setIsEnabled] = useState(false);

  const [gameError, setGameError] = useState('');
  const [tagError, setTagError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  // Load data from initial value
  // Note: initialValue is not used for default useState value because initalValue data will not be avalible on first render
  useEffect(() => {
    const updateValues = async () => {
      setTitle(initialValue.title);
      setDescription(initialValue.description);
      setStartTime(dayjs(initialValue.startTime));
      setEndTime(dayjs(initialValue.endTime));
    };

    if (initialValue) {
      updateValues();
    }
  }, [initialValue]);

  // Manage enabled state
  useEffect(() => {
    const validTags = tags.every((tag) => tag.name.length <= 10);
    const validTagCount = tags.length <= 4;
    setIsEnabled(
      game?.name?.length >= 3 &&
        title.length >= 3 &&
        description.length <= 1500 &&
        startTime !== null &&
        endTime !== null &&
        startTime.isAfter(dayjs()) &&
        startTime.isBefore(endTime) &&
        endTime.isBefore(startTime.add(24, 'hours')) &&
        endTime.isAfter(startTime) &&
        validTags &&
        validTagCount,
    );
  }, [game, title, endTime, startTime, description.length, tags]);

  // Handles game state error
  const handleGameChange = (e) => {
    if (e === null || e.length < 3) {
      setGameError('Game must be longer than 3 characters');
      setGame(e);
      setIsEnabled(false);
    } else {
      setGameError('');
      setGame(e);
      setIsEnabled(true);
    }
  };

  // Handles tag state error
  const handleTagChange = (e) => {
    const validTags = e.length <= 4 && e.every((tag) => tag.name.length <= 10);
    if (!validTags) {
      setTagError(
        'Ensure tags are up to 10 characters and no more than 4 tags.',
      );
      setIsEnabled(false);
    } else {
      setTagError('');
      setTags(e);
    }
  };

  // Handles title state error
  const handleTitleChange = (e) => {
    if (e.target.value.length < 3 && e.target.value.length > 0) {
      setTitleError('Title must be longer than 3 characters');
      setTitle(e.target.value);
    } else {
      setTitleError('');
    }
    setTitle(e.target.value);
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

  // Handles description change state error
  const handleDescriptionChange = (e) => {
    if (e.length > 1500) {
      setDescriptionError('Description cannot exceed 1500 characters');
      setDescription(e);
    } else {
      setDescriptionError('');
      setDescription(e);
    }
  };

  // Handles end date state error
  const handleEndDateChange = (e) => {
    if (e === null) {
      setEndDateError('Time cannot be empty');
      setEndTime(e);
    } else if (e.isAfter(startTime.add(24, 'hours'))) {
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

    try {
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

      onSubmit(post);
    } catch (e) {
      // Error notification
      Store.addNotification({
        title: 'Error has occured',
        message: 'An error has occured.\n' + e,
        type: 'danger',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
      console.error('Error in post form: ', e);
    }
  };

  const getPreviewTags = () => {
    if (tags?.length === 0) {
      return ['Tag1', 'Tag2'];
    }

    return tags?.map((tag) => tag.name);
  };

  // Returns form component to be displayed
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
      <div>
        <PostCard
          post={{
            creator: user,
            game: game?.name ?? 'Game Name',
            title: title.length > 0 ? title : 'Post Title',
            description:
              description.length > 0 ? description : 'Post Description',
            startTime: startTime,
            endTime: endTime,
            tags: getPreviewTags(),
          }}
          showActions={false}
        />
      </div>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault();
        }}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}
      >
        <TextField
          required
          fullWidth
          error={titleError !== ''}
          id="searchGames"
          helperText={titleError}
          minLength={3}
          maxLength={25}
          label="Title"
          autoFocus
          value={title}
          onChange={handleTitleChange}
        />
        <GameSelector
          onChange={handleGameChange}
          helperText={gameError}
          error={game?.length < 3}
          initialValue={initialValue?.game}
        />
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
                  endTime.isAfter(startTime.add(24, 'hours')) ||
                  endTime.isBefore(startTime),
                helperText: endDateError,
              },
            }}
          />
        </LocalizationProvider>
        <TagsSelector
          onChange={handleTagChange}
          helperText={tagError}
          initialValues={initialValue?.tags}
        />
        <TextField
          error={description.length > 1500}
          label="Description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          helperText={descriptionError}
          multiline
          rows={3}
        ></TextField>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 0, mb: 0 }}
          disabled={!isEnabled}
        >
          {submitButtonText}
        </Button>
      </Box>
    </Box>
  );
};

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

// Game selector that displays a drop down and lets you choose a game
// or create one
const GameSelector = ({ onChange, initialValue }) => {
  const [gameOptions, setGameOptions] = useState([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const getGames = async () => {
      try {
        const game = await GameService.searchGames('');
        setGameOptions(game);
        const gameChoice = game.find((g) => g.name === initialValue);
        if (gameChoice) {
          setValue(gameChoice);
        }
      } catch (e) {
        console.error('Problem getting games', e);
      }
    };

    getGames();
  }, [initialValue]);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const onInputChange = (event, newValue) => {
    try {
      setValue(newValue);
      if (newValue && newValue.name && newValue.name.length < 3) {
        setError(true);
      } else {
        setError(false);
      }
    } catch (err) {
      setError(true);
    }
    setValue(newValue);
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

  // Returns Game selector field
  return (
    <Autocomplete
      required
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
          label="Add/Create a Game"
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
const TagsSelector = ({ onChange, initialValues }) => {
  const [tagOptions, setTagOptions] = useState([]);
  const [value, setValue] = useState([]);
  const [error, setError] = useState(false);

  // Load initial values
  useEffect(() => {
    const getTags = async () => {
      try {
        const tags = await TagService.searchTags('');
        setTagOptions(tags);

        if (initialValues?.length > 0) {
          const initialTags = tags.filter((tag) =>
            initialValues.includes(tag.name),
          );
          setValue(initialTags);
        }
      } catch (e) {
        console.error('Something went wrong getting tags: ', e);
      }
    };
    getTags();
  }, [initialValues]);

  const onInputChange = (event, newValues) => {
    if (newValues.length > 4) {
      setError(true);
    } else if (newValues.some((tag) => tag.name.length > 10)) {
      setError(true);
    } else {
      setError(false);
    }

    setValue(newValues);
  };

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  const onFilterOptions = (options, params) => {
    const filtered = filter(options, params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some(
      (option) => inputValue.toLowerCase() === option.name,
    );
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        id: null,
        name: inputValue.toLowerCase(),
      });
    }

    return filtered;
  };

  // Returns tag selector field
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
        <TextField
          {...params}
          label="Add/Create Tags"
          error={error}
          placeholder=""
          helperText={
            error
              ? value.length > 4
                ? `You can only add up to 4 tags.`
                : `Tag cannot exceed 10 characters.`
              : ''
          }
        />
      )}
    />
  );
};

export default PostForm;
