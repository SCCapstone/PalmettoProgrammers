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

window.gameDetails = '';
window.tagsDetails = '';

// globalGameDetails = (value) => {
//   if (gameDetails === null) {
//     gameDetails = "";
//     console.log(gameDetails);
//   }
//   gameDetails = value;
//   console.log(gameDetails);
// }

export default function Edit({ postId }) {
  const [game, setGame] = useState();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(30, 'minute'));
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  //const [count, setCount] = useState(0);
  //const [details, setDetails] = useState('');
  //const [globalDetails, setGlobalDetails] = useState('');
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  useEffect(() => {
    const init = async () => {
      try {
        const postDetails = await PostService.getPostDetails(postId);
        if (user.id !== postDetails.creator.id) {
          alert('You are not authorized to edit this post');
          navigate(`/discover`);
        }
        //setDetails(postDetails);
        //if(title !== postDetails.title && count === 0) {
        setTitle(postDetails.title); //works
        //}

        setDescription(postDetails.description); //works
        // if (postDetails.game) {
        //   setGame(postDetails.game);
        // }
        //postDetails.games
        setGame(postDetails.game);
        //setGame(postDetails.game);
        //console.log(game);
        gameDetails = postDetails.game;
        //tagsDetails = postDetails.tags;
        //console.log(tagsDetails);
        //globalGameDetails(game);
        //console.log(gameDetails);
        //console.log(gameDetails);
        //console.log(postDetails.game);
        setStartTime(dayjs(postDetails.startTime)); //works
        setEndTime(dayjs(postDetails.endTime)); //works
        //console.log(startTime);
        // setStartTime(postDetails.startTime);
        // setEndTime(postDetails.endTime);
        // setStartTime(postDetails.startTime.toISOString); //gives me an error blacking the screen out. if the catch isn't getting it, it might be a run time error.
        // setEndTime(postDetails.endTime.toISOString);
        setTags(postDetails.tags);
        console.log(tags); //not getting the value for some reason.
        console.log(postDetails.tags);
        tagsDetails = postDetails.tags;
        console.log(tagsDetails);
        //console.log(postDetails.tags);
        //setCount(count + 1);
      } catch (e) {
        console.log(e);
      }
    };

    init();
    //}, [title, description, startTime, endTime]);
    //}, [title, description, startTime, endTime, count]);
  }, []);
  //}, [game, tags]);

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
      console.log(e);
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
      const newPost = await PostService.updatePost(updatedPost, postId);
      console.log(newPost);
      alert('Post updated successfully!');
      navigate(`/posts/${postId}`);
    } catch (e) {
      window.alert(e);
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
            <GameSelector
              value={gameDetails}
              //inputValue = {game}
              // onChange={setGame(globalDetails)} />
              //onChange={(newValue) => setGame(newValue)}
              //onChange={(gameDetails) => setGame(gameDetails)}
              onChange={setGame}
            />
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
          <TagsSelector value={tagsDetails} onChange={setTags} />
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

const GameSelector = ({ value: gameDetails, onChange }) => {
  // const GameSelector = ({ inputValue: game, onChange }) => {
  //const GameSelector = ({ newValue, onChange}) => {
  //const GameSelector = ({ onChange }) => {
  const [gameOptions, setGameOptions] = useState([]);
  //const [value, setValue] = useState(defaultVal || '');
  const [value, setValue] = useState('');
  //const [game, setGame] = useState('');

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
      autoHighlight
      clearOnBlur
      //value={game? game : game}
      //value={game? game : null}
      //value={game}
      //value={String(gameDetails)}
      //value={value}
      value={value}
      //defaultValue={gameDetails}
      //inputValue = {game}
      //defaultValue={defaultVal}
      //defaultValue={value}
      onChange={onInputChange}
      options={gameOptions}
      //disableCloseOnSelect
      filterOptions={onFilterOptions}
      //getOptionLabel={(o) => (o ? o.name : '')}
      //getOptionLabel={(o) => (game)}
      //getOptionLabel={(o) => (o ? game : "") }
      //getOptionLabel={(o) => (o ? game : o.name)}
      //getOptionLabel={(o) => (o ? o.name : game)}
      getOptionLabel={(option) =>
        typeof option === 'string' ? gameDetails : option.name
      } //working
      isOptionEqualToValue={(option, value) => option.name === value.name}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      renderInput={(params) => (
        <TextField
          {...params}
          autoHighlight
          //value={game? game: game}
          //value={game? game: null}
          //value={game}
          //value={String(gameDetails)}
          value={value}
          //defaultValue={game}
          //defaultValue={value}
          label="Game"
          required
          placeholder="Select or create a game"
        />
      )}
    />
  );
};

//const TagsSelector = ({ onChange }) => {
const TagsSelector = ({ value: tagsDetails, onChange }) => {
  const [tagOptions, setTagOptions] = useState([]);
  //const [tags, setTags] = useState([]);
  //const [value, setValue] = useState('');
  const [value, setValue] = useState(null);
  //const [count, setCount] = useState(0);

  useEffect(() => {
    TagService.searchTags('').then((tags) => setTagOptions(tags));
    //setValue(tagsDetails);
    // try {
    //   console.log(tagsDetails);
    // } catch (error) {
    //   console.log(error);
    // }

    // if(count === 0) {
    //   setValue(prevTags);
    // }
    //const tagOps = tagOptions.find((object) => object.name === prevTags);
    // tagOps.forEach(element => {
    //   if(prevTags[element] === tagOps[element]) {
    //     setTags(tagOps);
    //   } else {
    //     alert("Tags in tags selector not the same");
    //   }
    // });
    //for(var i = 0; (i < prevTags.length); i++) {
    //if(prevTags[i] === tagOps[i]) {
    // if(tagOps) {
    //   setTags(tagOps);
    // } else {
    //   alert("Tags in tags selector not the same");
    // }
    //}
    // setCount(count + 1);
    //}, [count]);
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
      value={tagsDetails}
      onChange={onInputChange}
      options={tagOptions}
      //disableCloseOnSelect
      filterOptions={onFilterOptions}
      //option needs to be "string" not "object", even though object is kind of working.
      getOptionLabel={(option) =>
        typeof option === 'object' ? tagsDetails : option
      } //half-way working
      //getOptionLabel={(option) => typeof option === "string" ? tagsDetails : option}
      //need to make tagsDetails into a string. The below optionlabel causes a double. Ex: "tag1, tag2" "tag1, tag2"
      //getOptionLabel={(option) => typeof option === "string" ? String(tagsDetails) : option}
      //getOptionLabel={(option) => typeof option === "string" ? tagsDetails.name : option}
      // The below option label causes a double similar to one of those above, but causes them to stack tag1 on top of tag 2 in the same in cases tag.
      // getOptionLabel={(option) => typeof option === "string" ? tagsDetails.map(item => (
      //   <div key={item}>
      //     {item}
      //   </div>
      // )) : option}
      //getOptionLabel={(option) => typeof option === "string" ? String(tagsDetails).split('') : option}
      //getOptionLabel={(option) => typeof option === "string" ? String(tagsDetails).split(', ') : option}
      //getOptionLabel={(option) => typeof option === "string" ? String(tagsDetails).split(',') : option}
      //getOptionLabel={(option) => typeof option === "string" ? String(tagsDetails).split(' ') : option}
      //getOptionLabel={(option) => typeof option === "string" ? String(tagsDetails).split('') : option}
      // The below option label causes a double of invisible tags, tag 1, and tag2, depending on which tag you click.
      //getOptionLabel={(option) => typeof option === "string" ? value : option}
      //getOptionLabel={(option) => typeof option === "string" ? value : option.name}
      //getOptionLabel={(option) => typeof option === "string" ? tagsDetails.name : option}
      //getOptionLabel={(option) => typeof option === "string" ? tagsDetails : option}
      //getOptionLabel={(option) => typeof option === "object" ? tagsDetails : option.name}
      //getOptionLabel={(option) => typeof option === "string" ? String.split(tagsDetails) : option}
      //getOptionLabel={(option) => option.name}
      //getOptionLabel={(o) => o.name}
      //getOptionLabel={(option) => typeof option === "string" ? prevTags : option.name} //prevTags is now tagsDetails
      //getOptionLabel={(option) => typeof option === "string" ? prevTags : tagOptions}
      //getOptionLabel={(option) => typeof option === "string" ? tagOptions : prevTags}
      //getOptionLabel={(option) => typeof option === "string" ? option.name : tagOptions}
      //getOptionLabel={(option) => typeof option === "string" ? tagOptions : option.name}
      //getOptionLabel={(option) => typeof option === "string" ? option : option.name}
      //getOptionLabel={(option) => typeof option === "string" ? gameDetails : option.name} //working for games
      //getOptionLabel={(option) => typeof option === "object" ? value : option.name}
      //getOptionLabel={(option) => typeof option === "object" ? tagOptions : option.name}
      //getOptionLabel={(option) => typeof option === "object" ? option : option.name}
      //getOptionLabel={(o) => (o ? option : o.name)}
      //getOptionLabel={(o) => }
      isOptionEqualToValue={(option, value) => option.name === value}
      //isOptionEqualToValue={(option, value) => (option.name === value.name)}
      //isOptionEqualToValue={(option, value) => (tagsDetails.name === option.name)}
      //isOptionEqualToValue={(option, value) => (o ? (option.name === value.name) : prevTags)}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            autoHighlight
            icon={checkboxIconBlank}
            checkedIcon={checkboxIconChecked}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} value={value} label="Tags" placeholder="" />
      )}
    />
  );
};
