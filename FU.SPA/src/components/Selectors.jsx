import { useEffect, useState } from 'react';
import GameService from '../services/gameService';
import TagService from '../services/tagService';
import { Checkbox, TextField, Autocomplete, NativeSelect } from '@mui/material';
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

  return (
    // change autocomplete to a select, not input. mui docs will show the on change method is.
    <NativeSelect
      defaultValue={1}
      inputProps={{
        name: 'Sort',
        id: 'sort-filter',
      }}
    >
      <option value={1}>Newest</option>
      <option value={2}>Oldest</option>
      <option value={3}>Title: A-Z</option>
      <option value={4}>Title: Z-A</option>
      <option value={5}>Start Time: Asc</option>
      <option value={6}>Start Time: Desc</option>
    </NativeSelect>
  );
};