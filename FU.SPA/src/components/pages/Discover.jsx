import { TextField, Typography, Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useSearchParams  } from 'react-router-dom';
import { TagsSelector, GamesSelector } from '../Selectors';
import SearchService from '../../services/searchService';
import GameService from '../../services/gameService';
import TagService from '../../services/tagService';
import Posts from '../Posts';
import './Discover.css';

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const postsPerPage = 10; // limit of posts on a page(increase later, low for testing)

  // initial state
  const initialSearchText = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;
  const initialGames = searchParams.getAll('game').map(gameId => ({ id: gameId }));
  const initialTags = searchParams.getAll('tag').map(tagId => ({ id: tagId }));

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [games, setGames] = useState(initialGames);
  const [tags, setTags] = useState(initialTags);
  const [gameOptions, setGameOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  // index of the last post
  const lastPost = page * postsPerPage;
  // index of first
  const firstPost = lastPost - postsPerPage;

  // each page has correct number of posts
  const currentPosts = posts.slice(firstPost, lastPost);

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

  useEffect(() => {
    // Fetch games and tags for selectors
    const fetchOptions = async () => {
      const games = await GameService.searchGames('');
      const tags = await TagService.searchTags('');
      setGameOptions(games);
      setTagOptions(tags);
    };
  
    fetchOptions();
  }, []);

  // function for search submissions
  const searchSubmit = (newSearchText) => {
    setSearchText(newSearchText);
    setPage(1); // reset to page 1 on new search
  };
  
  // handle filter changes
  const handleFilterChange = (newGames, newTags) => {
    setGames(newGames);
    setTags(newTags);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  searchParams.set('page', value.toString());
  setSearchParams(searchParams);
  };  

  useEffect(() => {
    // build query string
    const newSearchParams  = new URLSearchParams();
    if (searchText) newSearchParams.append('q', searchText);
    if (page > 1) newSearchParams.set('page', page);
    games.forEach(game => newSearchParams.append('game', game.id));
    tags.forEach(tag => newSearchParams.append('tag', tag.id));

    setSearchParams(newSearchParams, { replace: true });
  }, [searchText, page, games, tags, setSearchParams]);

  useEffect(() => {
    const gamesUrl = searchParams.getAll('game');
    const tagsUrl = searchParams.getAll('tag');

    const restoredGames = gamesUrl.map(gameId => 
      gameOptions.find(game => game.id.toString() === gameId) || { id: gameId}
    );
    
    const restoredTags = tagsUrl.map(tagId => 
      tagOptions.find(tag => tag.id.toString() === tagId) || { id: tagId}
    );
    setGames(restoredGames);
    setTags(restoredTags);
  }, [searchParams, gameOptions, tagOptions]);

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: 'left', minWidth: '200pt',  maxWidth:'300px'  }}>
        <Typography variant="h5">Filters</Typography>
        <GamesSelector value={games} onChange={(e, newGames) => handleFilterChange(newGames, tags)} options={gameOptions} />
        <TagsSelector value={tags} onChange={(e, newTags) => handleFilterChange(games, newTags)}  />
      </div>
      <div>
        <SearchBar searchText={searchText} onSearchSubmit={searchSubmit} />
        <Posts posts={currentPosts} />
        <div style={{display: 'flex', justifyContent: 'center', marginTop:'20px', marginRight:'150px'}}>
        <Stack spacing={2} >
    <Typography>Page: {page}</Typography>
    <Pagination 
          count={Math.ceil(posts.length / postsPerPage)} 
          page={page} 
          onChange={handlePageChange} />
  </Stack>
  </div>
      </div>
    </div>
  );
}

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
