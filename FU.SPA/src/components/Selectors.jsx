import { useEffect, useState } from 'react';
import GameService from '../services/gameService';
import TagService from '../services/tagService';
import {
  Checkbox,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;

export const GamesSelector = ({ value, onChange }) => {
  const [gameOptions, setGameOptions] = useState([]);

  useEffect(() => {
    GameService.searchGames('').then((games) => setGameOptions(games));
  }, []);

  return (
    <Autocomplete
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
        <TextField
          {...params}
          label="Games"
          placeholder=""
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Handle Enter key press
              GameService.searchGames('').then((games) =>
                setGameOptions(games),
              );
            }
          }}
        />
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
      autoHighlight
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
        <TextField
          {...params}
          label="Tags"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-tag', //disable autcomplete and autofill.
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Handle Enter key press
              TagService.searchTags('').then((tags) => setTagOptions(tags));
            }
          }}
          placeholder=""
        />
      )}
    />
  );
};

/**
 * The SortOptionsSelector component allows the user to select a sorting option.
 * It displays a dropdown list of sorting options and calls the onChange function
 * when the user selects an option.
 *
 *
 * @param {Object} options The array of sorting options to display in the dropdown list. Each option should have a value and a label.
 * @param {Function} onChange The function to call when the user selects an option. The function should accept the new value as an argument.
 */
export const SortOptionsSelector = ({ options, onChange }) => {
  // Default sort order is descending in the api
  const [ascSortOrder, setAscSortOrder] = useState(false);
  const [optionValue, setOptionValue] = useState(options[0].value);

  /**
   * Handle the change of the form control
   *
   * @param {string} type the type of value being changed
   * @param {Object} newValues the new values object {optionValue, ascSortOrder}
   */
  const handleFormControlChange = (type, newValues) => {
    if (type === 'option') {
      setOptionValue(newValues.optionValue);
    } else if (type === 'order') {
      setAscSortOrder(newValues.ascSortOrder);
    }

    // We need to create a string to pass to the parent onChange handler
    // The api expects the format: optionValue:asc or optionValue:desc
    let sortByString =
      newValues.optionValue + (newValues.ascSortOrder ? ':asc' : ':desc');

    // Call the parent onChange handler
    if (onChange) onChange(sortByString);
  };

  return (
    <FormControl
      style={{ display: 'flex', flexDirection: 'row', height: 'fit-content' }}
    >
      <InputLabel id="sort-option-label">Sort by</InputLabel>
      <Select
        labelId="sort-option-label"
        label="Sort by"
        value={optionValue}
        onChange={(e) => {
          handleFormControlChange('option', {
            optionValue: e.target.value,
            ascSortOrder: ascSortOrder,
          });
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <Tooltip title="Toggle Sort Order">
        <IconButton
          onClick={() =>
            handleFormControlChange('order', {
              ascSortOrder: !ascSortOrder,
              optionValue: optionValue,
            })
          }
        >
          {ascSortOrder ? <ArrowUpward /> : <ArrowDownward />}
        </IconButton>
      </Tooltip>
    </FormControl>
  );
};
