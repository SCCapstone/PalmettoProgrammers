import { useEffect, useState } from 'react';
import GameService from '../services/gameService';
import TagService from '../services/tagService';
import { Checkbox, TextField, Autocomplete, Select, MenuItem, InputLabel, NativeSelect, FormControl } from '@mui/material';
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

// Function that displays/returns a Select component for selecting the asc/dsc
// filter state
export const SortOptionSelector = ({ onChange }) => {
  // newest is most recent posted. soonest is the soonest start time.
  // var options = ['Newest', 'Oldest', 'Title: A-Z', 'Title: Z-A', 'Start Time: Asc', 'Start Time: Desc' ];
  const [sortOption, setSortOption] = useState('');

  const handleChange = (event) => {
    setSortOption(event.target.value);
  }

  return (
    <FormControl fullWidth>
    <InputLabel id="sort-filter-label">Sort Filter</InputLabel>
    <Select
      label="Sort Options"
      labelId="sort-filter-label"
      id="sort-filter"
      value={sortOption}
      onChange={handleChange}
    >
      <MenuItem value={'newest:asc'}>Newest</MenuItem>
      <MenuItem value={'newest:desc'}>Oldest</MenuItem>
      <MenuItem value={'title:asc'}>Title: A-Z</MenuItem>
      <MenuItem value={'title:desc'}>Title: Z-A</MenuItem>
      <MenuItem value={'soonest:asc'}>Start Time: Asc</MenuItem>
      <MenuItem value={'soonest:desc'}>Start Time: Desc</MenuItem>
    </Select>
    </FormControl>
  );
};