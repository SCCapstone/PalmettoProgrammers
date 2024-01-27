import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TagsSelector, GamesSelector } from '../Selectors';
import SearchService from '../../services/searchService';
import Posts from '../Posts';
import './Discover.css';

export default function Discover() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialSearchText = searchParams.get('q') || '';
  const initialGames = searchParams.getAll('game');
  const initialTags = searchParams.getAll('tag');
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [games, setGames] = useState([]);
  const [tags, setTags] = useState([]);
  
  useEffect(() => {
    // update searchText when query changes
    setSearchText(searchParams.get('q') || '');
  }, [location]); 

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


  // function for search submissions
  const searchSubmit = (newSearchText) => {
    setSearchText(newSearchText);
    updateURL(newSearchText, games, tags);
  };
  
  useEffect(() => {
    // build query string
    const params = new URLSearchParams();
    if (searchText) params.append('q', searchText);
    games.forEach(game => params.append('game', game));
    tags.forEach(tag => params.append('tag', tag));

    // update URL
    navigate(`/discover?${params.toString()}`, { replace: true });
  }, [searchText, games, tags, navigate]);

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: 'left', minWidth: '200pt' }}>
        <Typography variant="h5">Filters</Typography>
        <GamesSelector onChange={(e, v) => setGames(v)} />
        <TagsSelector onChange={(e, v) => setTags(v)} />
      </div>
      <div>
        <SearchBar searchText={searchText} onSearchSubmit={searchSubmit} />
        <Posts posts={posts} />
      </div>
    </div>
  );
}

function SearchBar({ searchText, onSearchSubmit }) {
  const [localSearchText, setLocalSearchText] = useState(searchText);

  useEffect(() => {
    setLocalSearchText(searchText);
  }, [searchText]);

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      //event.preventDefault();
      onSearchSubmit(localSearchText);
    }
  };

  const handleChange = (event) => {
    setLocalSearchText(event.target.value);

  };
  
  return (
    <div id="search-bar">
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        value={localSearchText}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
