import { useEffect, useState } from 'react';
import GameService from '../services/gameService';
import TagService from '../services/tagService';
import { Checkbox, TextField, Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;

// const handleKeyEnter = (e) => {
//   if(e.keyCode == 13) {
//     console.log('value', e.target.value);

//   }
// }

export const GamesSelector = ({ value, onChange, keydown}) => {
  const [gameOptions, setGameOptions] = useState([]);

  // const handleKeyEnter = (e) => {
  //   if(e.keyCode == 13) {
  //     console.log('value: ', e.onKeyDown);
  //     GameService.searchGames('').then((games) => setGameOptions(games));
  //   }
  // }

  useEffect(() => {
    //document.addEventListener('keydown', handleKeyEnter, true);
    // const handleKeyDown = (event) => {
    //   if (event.key === "Enter") {
    //     event.preventDefault();
        
    //   }
    // }
    // if () {

    // }
    GameService.searchGames('').then((games) => setGameOptions(games));
    // if (gameOptions) {
    //   console.log(`Selected gameOption: ${gameOptions.values}`);
    // }
  }, []);

  return (
    <Autocomplete
      autoSelect= {true}//may need to remove
      autoHighlight
      multiple
      value={value}
      onChange={onChange}
      
      //onKeyDown={keydown}
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
            // var gs = GameService.searchGames(event.target.value).then((games) => setGameOptions(games));
            // GameService.searchGames('').then((games) => setGameOptions(games));
            // if (event.target.value === gs) {
              
            // }

            // for(var i = 0; i < params.size; i++) {
            //   if (event.target.value === params[i]) {
            //     GameService.searchGames(event.target.value).then((games) => setGameOptions(games));
            //   }
            // }
            // GameService.searchGames(onChange).then((games) => setGameOptions(games));
            // GameService.searchGames(event.target.value).then((games) => setGameOptions(games));
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
        <TextField {...params} label="Tags" placeholder="" />
      )}
    />
  );
};
