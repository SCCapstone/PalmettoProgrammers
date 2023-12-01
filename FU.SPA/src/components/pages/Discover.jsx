import { Autocomplete, Checkbox, TextField, Typography } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useEffect, useState } from "react";
import SearchService from "../../services/searchService";
import GameService from "../../services/gameService";
import Posts from "../Posts";
import "./Discover.css"

const checkboxIconBlank = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxIconChecked = <CheckBoxIcon fontSize="small" />;

export default function Discover() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [games, setGames] = useState([]);

  useEffect(() => {
    submitSearch();
  }, [games, searchText]);

  const submitSearch = async () => {
    const query = {
      keywords: searchText,
      games: games,
    };

    const response = await SearchService.searchPosts(query);
    setPosts(response);
  };

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: "left", minWidth: "200pt" }}>
        <Typography variant="h5">
          Filters
        </Typography>
        <GamesSelector onChange={(e, v) => setGames(v)} />
      </div>
      <div>
        <SearchBar onSearchSubmit={setSearchText} />
        <Posts posts={posts} />
      </div>
    </div >
  );
}

function GamesSelector({ onChange }) {
  const [gameOptions, setGameOptions] = useState([]);

  useEffect(() => {
    GameService.searchGames("").then(games => setGameOptions(games));
  }, []);

  return (
    <Autocomplete
      multiple
      onChange={onChange}
      options={gameOptions}
      disableCloseOnSelect
      getOptionLabel={option => option.name}
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
  )
}

function SearchBar({ onSearchSubmit }) {
  const [searchText, setSearchText] = useState("");

  function onKeyDown(event) {
    if (event.key === "Enter") {
      onSearchSubmit(searchText)
    }
  }

  return (
    <div id='search-bar'>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}