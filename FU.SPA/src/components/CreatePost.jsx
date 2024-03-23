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
  const [title, setTitle] = useState(null);
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(30, 'minute'));
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  
  
  const handleGameErrorChange = (error) => {
    return(error); //was setError(error); but it caused some issues. may delete at later date.
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tagIds = [];

    for (const tag of tags) {
      const newTag = await TagService.findOrCreateTagByName(tag.name);
      tagIds.push(newTag.id);
    }

    if (
      game === '' ||
      game === null ||
      game.name === null ||
      game.name === ''
    ) {
      //setGame('default');
      setError(true);
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
      if (
        game === null ||
        game === '' ||
        game.length < 3
      ) {
        setError(true);
      } else {
        const newPost = await PostService.createPost(post);
        navigate(`/posts/${newPost.id}`);
      }
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };

  return (
    <>
      {error || game?.length < 3? ( //if there's an error 
        <div>
          <div>
            <Container component="main" maxWidth="xs">
              <Box
                sx={{
                  marginTop: 0,
                  m: 0,
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
                    mt: 0,
                    gap: 1,
                  }}
                >
                  {(title?.length < 3) || error? ( //if title does have an error of a length too short
                    <div>
                      <TextField
                        fullWidth
                        error={title?.length < 3 && title!==null}
                        id="searchGames"
                        helperText="Must be at least 3 characters"
                        minLength={3}
                        maxLength={25}
                        label="Title *"
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div>
                      <TextField
                        fullWidth
                        id="searchGames"
                        minLength={3}
                        maxLength={25}
                        label="Title *"
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  )}
                  <Grid item xs={0}>
                    <GameSelectorError required={game?.length < 3} error={game?.length < 3} onChange={setGame} onErrorChange={handleGameErrorChange}/>
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
                  >
                    Create Post
                  </Button>
                </Box>
              </Box>
            </Container>
          </div>
        </div> //if there's no error
      ) : (
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 0,
              m: 0,
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
                mt: 0,
                gap: 1,
              }}
            >
              {/* <TextField
                fullWidth
                minLength={3}
                maxLength={25}
                id="searchGames"
                label="Title *" //might want to put a Search icon in front, if we can figure it out.
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              /> */}
              {(title?.length < 3) || error? ( //if title does have an error or a length too short
                <div>
                  <TextField
                    error={title?.length < 3 && title !== null}
                    fullWidth
                    id="searchGames"
                    helperText="Must be at least 3 characters"
                    minLength={3}
                    maxLength={25}
                    label="Title *"
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              ) : ( //if title is not less than 3 and there isn't an error
                <div>
                  <TextField
                    error={title?.length < 3 && title !== null}
                    fullWidth
                    id="searchGames"
                    minLength={3}
                    maxLength={25}
                    label="Title"
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              )}
              <div>
                <Grid item xs={0}>
                  <GameSelector required={game?.length < 3 && game !== null} error={game?.length < 3 || game === null} onChange={setGame} onErrorChange={handleGameErrorChange}/>
                </Grid>
              </div>
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
              >
                Create Post
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

const GameSelector = ({ onChange, onErrorChange }) => {
  const [gameOptions, setGameOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      // if(value?.length < 3) {
      //   setError(true);
      // } else {
      //   setError(false);
      // }
      // if (
      //   GameService.searchGames('').then((games) => setGameOptions(games)) ===
      //   null
      // ) {
      //   setError(true);
      // }
      if(value?.length < 3) {
        setError(true);
      } else {
        setError(false);
      }
      var test = GameService.searchGames('').then((games) =>
        setGameOptions(games),
      );
      console.log(test);
      GameService.searchGames('').then((games) => setGameOptions(games));
    } catch (err) {
      if (value?.length < 3) {
        setError(true);
      }
      var test = GameService.searchGames('').then((games) =>
        setGameOptions(games),
      );
      console.log(test);
      setError(true);
      //setGameOptions('default');
    }
  }, [value]);

  const onInputChange = (event, newValue) => {
    console.log('newValue');
    console.log(newValue);
    try {
      if (
        gameOptions === null ||
        value === null ||
        newValue === null ||
        newValue === '' ||
        newValue.value === null ||
        newValue.value === ''
      ) {
        setError(true);
      } else {
        setError(false);
      }
      setValue(newValue);
      // onErrorChange(value?.length < 3 || error === true);
      onChange(newValue);
    } catch (err) {
      setError(true);
    }
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
    <>
      {error ? ( //if there's an error display this
        <div>
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
                error={value?.length < 3}
                required={value?.length < 3}
                minLength={3}
                maxLength={25}
                label="Game"
                helperText={value !== null && value.length < 3 ? "Must be at least 3 characters" : ""}
              />
            )}
          />
        </div>
      ) : (
        <Autocomplete //if there's no error display this
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
              error={value?.length < 3}
              required={value?.length < 3}
              label="Game"
              minLength={3}
              maxLength={25}
              helperText={value?.length < 3 ? "Must be at least 3 characters" : ""}
            />
          )}
        />
      )}
    </>
  );
};

const GameSelectorError = ({ onChange, onErrorChange }) => {
  const [gameOptions, setGameOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      // if (
      //   GameService.searchGames('').then((games) => setGameOptions(games)) ===
      //   null
      // ) {
      //   setError(true);
      // }
      if(value?.length < 3) {
        setError(true);
      } else {
        setError(false);
      }
      var test = GameService.searchGames('').then((games) =>
        setGameOptions(games),
      );
      console.log(test);
      console.log(error);
      GameService.searchGames('').then((games) => setGameOptions(games));
    } catch (err) {
      var test = GameService.searchGames('').then((games) =>
        setGameOptions(games),
      );
      console.log(test);
      setError(true);
      //setGameOptions('default');
    }
  }, [value]);

  const onInputChange = (event, newValue) => {
    console.log('newValue');
    console.log(newValue);
    try {
      if (
        gameOptions === null ||
        value === null ||
        newValue === null ||
        newValue === '' ||
        newValue.value === null ||
        newValue.value === ''
      ) {
        setError(true);
      } else {
        setError(false);
      }
      setValue(newValue);
      onChange(newValue);
    } catch (err) {
      setError(true);
    }
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
    <>
      {error ? (
        <div>
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
              <div>
                <TextField
                  {...params}
                  error={value?.length < 3 && value !== null}
                  required={value?.length < 3}
                  minLength={3}
                  maxLength={25}
                  label="Game"
                  helperText={value?.length < 3 ? "Must be at least 3 characters" : ""}
                />
              </div>
            )}
          />
        </div>
      ) : (
        <div>
          <Autocomplete //if there's no error display this
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
                error={value?.length < 3}
                required={value?.length < 3}
                label="Game"
                minLength={3}
                maxLength={25}
                helperText={value?.length < 3 ? "Must be at least 3 characters" : ""}
              />
            )}
          />
        </div>
      )}
    </>
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
