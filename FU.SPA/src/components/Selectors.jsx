import { useEffect, useState } from 'react';
import GameService from '../services/gameService';
import TagService from '../services/tagService';
import { Checkbox, TextField, Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;

export const GamesSelector = ({ value, onChange }) => {
  const [gameOptions, setGameOptions] = useState([]);

  useEffect(() => {
    GameService.searchGames('').then((games) => setGameOptions(games));
  }, []);

  return (
    <Autocomplete
      autoSelect= {true}//may need to remove
      autoHighlight
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
        <TextField {...params} label="Games" placeholder="" 
        inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password' //disable autcomplete and autofill.
        }}
        onKeyDown={ (event) => {
          if (event.key === 'Enter') {
            // Handle Enter key press
            console.log(event.target.value);
            GameService.searchGames('').then((games) => setGameOptions(games));
          }
        }}/>
      )}
    />
  );
};

export const TagsSelector = ({ value, onChange}) => {
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    TagService.searchTags('').then((tags) => setTagOptions(tags));
  }, []);

  return (
    <Autocomplete
      autoSelect = {true}
      autoHighlight
      multiple
      value={value}
      onChange={onChange}
      //onKeyDown={keydown}
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
        <TextField {...params} label="Tags" inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password' //disable autcomplete and autofill.
        }} onKeyDown={ (event) => {
          if (event.key === 'Enter') {
            // Handle Enter key press
            console.log(event.target.value);
            TagService.searchTags('').then((tags) => setTagOptions(tags));
          }
        }} placeholder="" />
      )}
    />
  );
};
