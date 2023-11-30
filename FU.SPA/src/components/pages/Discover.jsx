import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchService from "../../services/searchService";
import Posts from "../Posts";
import "./Discover.css"

export default function Discover() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    submitSearch();
  }, []);

  const submitSearch = async () => {
    console.log("Searching");

    const query = {
      keywords: searchText
    };

    const response = await SearchService.searchPosts(query);
    setPosts(response);
  };

  return (
    <div>
      <SearchBar onSearchText={searchText} onSearchChange={t => setSearchText(t)} onSearchSubmit={submitSearch} />
      <Posts posts={posts} />
    </div>
  );
}

function SearchBar({ onSearchText, onSearchChange, onSearchSubmit, onSortChange }) {
  function onKeyDown(event) {
    if (event.key === "Enter") {
      onSearchSubmit()
    }
  }

  return (
    <div id='search-bar'>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        value={onSearchText}
        onChange={e => onSearchChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

function FilterSidebar() {
  const [filters, setFilters] = useState({
    tags: [],
    games: [],
    afterDateTime: "",
    keywords: "",
    sort: "",
    limit: 20,
    offset: 0,
    minPlayers: 0,
  });
}