import { useEffect, useState } from 'react';
import GameService from '../services/gameService';
import TagService from '../services/tagService';
import { Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import './Selectors.css';
import { CustomAutocomplete } from '../helpers/styleComponents';

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;

  export const GamesSelector = ({value,  onChange }) => {
    const [gameOptions, setGameOptions] = useState([]);

    useEffect(() => {
        GameService.searchGames('').then((games) => setGameOptions(games));
    }, []);

  return (
    <CustomAutocomplete
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

export const TagsSelector = ({value, onChange }) => {
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    TagService.searchTags('').then((tags) => setTagOptions(tags));
  }, []);

  return (
    <CustomAutocomplete
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
