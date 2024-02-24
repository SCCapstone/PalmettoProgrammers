import { useEffect, useState } from 'react';
import GameService from '../services/gameService';
import TagService from '../services/tagService';
import { Checkbox, TextField, Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SortOptionService from '../services/sortOptionService';

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;

export const GamesSelector = ({ value, onChange }) => {
  const [gameOptions, setGameOptions] = useState([]);

  useEffect(() => {
    GameService.searchGames('').then((games) => setGameOptions(games));
  }, []);

  return (
    <Autocomplete
      multiple
      value={value}
      onChange={onChange}
      options={gameOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
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
        <TextField {...params} label="Games" placeholder="" />
      )}
    />
  );
};

export const TagsSelector = ({ value, onChange }) => {
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    TagService.searchTags('').then((tags) => setTagOptions(tags));
  }, []);

  return (
    <Autocomplete
      multiple
      value={value}
      onChange={onChange}
      options={tagOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
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


export const SortOptionSelector = ({ onChange }) => {
  // newest is most recent posted. soonest is the soonest start time.
  var options = ['Newest', 'Oldest', 'Title: A-Z', 'Title: Z-A', 'Start Time: Asc', 'Start Time: Desc' ];
  //var optionsVal = [1, 2, 3, 4, 5, 6];
  /*
   *<Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Age
        </InputLabel>
        <NativeSelect
          defaultValue={30}
          inputProps={{
            name: 'age',
            id: 'uncontrolled-native',
          }}
        >
          <option value={10}>Ten</option>
          <option value={20}>Twenty</option>
          <option value={30}>Thirty</option>
        </NativeSelect>
      </FormControl>
    </Box>

    
   *function Form() {
      const [firstName, setFirstName] = useState('');
      return (
        <>
          <label>
            First name:
            <input value={firstName} onChange={e => setFirstName(e.target.value)} />
          </label>
          {firstName !== '' && <p>Your name is {firstName}.</p>}
   */
  return (
    // change autocomplete to a select, not input. mui docs will show the on change method is.
    <Autocomplete
      multiple
      onChange={onChange}
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => options.name}
      //value={(option) => optionsVal}
      renderOption={(props, option) => (
        <li {...props}>
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Sort" placeholder="" />
      )}
    />
  );
};