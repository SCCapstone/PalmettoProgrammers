import { TextField, Typography, Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TagsSelector, GamesSelector } from '../Selectors';
import SearchService from '../../services/searchService';
import Posts from '../Posts';
import './Discover.css';

export default function Discover() {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const postsPerPage = 10; // limit of posts on a page(increase later, low for testing)

  const searchParams = new URLSearchParams(location.search);
  const initialSearchText = searchParams.get('q') || '';
  const initialGames = searchParams.getAll('game').map(gameId => ({ id: gameId }));
  const initialTags = searchParams.getAll('tag').map(tagId => ({ id: tagId }));
  // index of the last post
  const lastPost = page * postsPerPage;
  // index of first
  const firstPost = lastPost - postsPerPage;

  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [games, setGames] = useState(initialGames);
  const [tags, setTags] = useState(initialTags);
  
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

  // function for search submissions
  const searchSubmit = (newSearchText) => {
    setSearchText(newSearchText);
    setPage(1); // reset to page 1 on new search
  };
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };  

  useEffect(() => {
    // build query string
    const params = new URLSearchParams();
    if (searchText) params.append('q', searchText);
    if (page > 1) params.set('page', page);
    games.forEach(game => game.id && params.append('game', game.id));
    tags.forEach(tag => tag.id && params.append('tag', tag.id));

    // update URL(only show page in URL if page > 1)
    navigate(`/discover${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
  }, [searchText, page, games, tags, navigate]);

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: 'left', minWidth: '200pt',  maxWidth:'300px'  }}>
        <Typography variant="h5">Filters</Typography>
        <GamesSelector onChange={(e, v) => setGames(v)} />
        <TagsSelector onChange={(e, v) => setTags(v)} />
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
