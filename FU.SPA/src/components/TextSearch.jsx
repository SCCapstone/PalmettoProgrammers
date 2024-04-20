import { TextField, InputAdornment, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

// Component search bar that handles searching of posts and users
function SearchBar({ searchText, onSearchSubmit }) {
  const [localSearchText, setLocalSearchText] = useState(searchText);

  useEffect(() => {
    setLocalSearchText(searchText);
  }, [searchText]);

  function onKeyDown(event) {
    if (event.key === 'Enter') {
      onSearchSubmit(localSearchText);
    }
  }

  function handleChange(event) {
    setLocalSearchText(event.target.value);
  }

  function onClick() {
    onSearchSubmit(localSearchText);
  }

  return (
    <div id="search-bar" style={{ marginBottom: '20px' }}>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        value={localSearchText}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        InputProps={{
          // Search button
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" color="white" onClick={onClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { color: 'white' },
        }}
      />
    </div>
  );
}
const TextSearch = {
  SearchBar,
};
export default TextSearch;
