import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TagsSelector, GamesSelector  } from '../Selectors';
import SearchService from '../../services/searchService';
import Posts from '../Posts';
import './Discover.css';

export default function Discover() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [games, setGames] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const submitSearch = async () => {
      const query = {
        keywords: searchText,
        games: games,
        tags: tags,
      };
  
      const response = await SearchService.searchPosts(query);
      setPosts(response);
    };
    
    submitSearch();
  }, [games, tags, searchText]);

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: 'left', minWidth: '200pt' }}>
        <Typography variant="h5">Filters</Typography>
        <GamesSelector onChange={(e, v) => setGames(v)} />
        <TagsSelector onChange={(e, v) => setTags(v)} />
      </div>
      <div>
        <SearchBar onSearchSubmit={setSearchText} />
        <Posts posts={posts} />
      </div>
    </div>
  );
}

function SearchBar({ onSearchSubmit }) {
  const [searchText, setSearchText] = useState('');

  function onKeyDown(event) {
    if (event.key === 'Enter') {
      onSearchSubmit(searchText);
    }
  }

  return (
    <div id="search-bar">
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
