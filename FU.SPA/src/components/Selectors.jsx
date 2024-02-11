import { useEffect, useState } from 'react';
import GameService from '../services/gameService';
import TagService from '../services/tagService';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AscDscService from '../services/ascDscService';

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;

export const GamesSelector = ({ onChange }) => {
  const [gameOptions, setGameOptions] = useState([]);

  useEffect(() => {
    GameService.searchGames('').then((games) => setGameOptions(games));
  }, []);

  return (
    <Autocomplete
      multiple
      onChange={onChange}
      options={gameOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
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

export const TagsSelector = ({ onChange }) => {
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    TagService.searchTags('').then((tags) => setTagOptions(tags));
  }, []);

  return (
    <Autocomplete
      multiple
      onChange={onChange}
      options={tagOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
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


export const AscDscSelector = ({ onChange }) => {
  const [ascDscOptions, setAscDscOptions] = useState([]);
  
  useEffect(() => {
    const ascDscChoices = [{ label: 'A-Z'}, { label: "Z-A"}];
    //setAscDscOptions(ascDscChoices);
    AscDscService.searchAscDsc('').then((ascDsc) => setAscDscOptions);
    //ascDscOptions.setAscDscOptions(ascDscOptions);
    // TagService.searchTags('').then((tags) => setTagOptions(tags));
    // GameService.searchGames('').then((games) => setAscDscOptions(games));
  }, []);

  return (
    <Autocomplete
      multiple
      onChange={onChange}
      options={ascDscOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={checkboxIconBlank}
            checkedIcon={checkboxIconChecked}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="A-Z or Z-A" placeholder="" />
      )}
    />
  );
};