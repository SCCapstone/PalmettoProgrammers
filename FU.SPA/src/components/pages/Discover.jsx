import { TextField, Typography, Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TagsSelector, GamesSelector, AscDscSelector } from '../Selectors';
import SearchService from '../../services/searchService';
import Posts from '../Posts';
import './Discover.css';

export default function Discover() {
  const location = useLocation();
  const navigate = useNavigate();
  const postsPerPage = 10; // limit of posts on a page(increase later, low for testing)

  // initial state
  const searchParams = new URLSearchParams(location.search);
  const initialSearchText = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;
  const initialGames = searchParams.getAll('game').map(gameId => ({ id: gameId }));
  const initialTags = searchParams.getAll('tag').map(tagId => ({ id: tagId }));
  const initialSortOption = searchParams.getAll('sortOption').map(ascDscId => ({ id: ascDscId})); //for ascending/descending filter

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [games, setGames] = useState(initialGames);
  const [tags, setTags] = useState(initialTags);
  const [sortOption, setSortOption] = useState(initialSortOption);
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
        //pass formatted option after :
        sortOption: sortOption,
      };
      //sortOption : asc
      const response = await SearchService.searchPosts(query);
      setPosts(response);
    };
    submitSearch();
  }, [games, tags, ascDscs, searchText]);

  //Create method here
  //if the option is newest, send to the api 'newest:asc'
  //if the option is oldest, send to the api 'newest:desc'
  //if the option is oldest, send to the api 'title:asc'
  //if the option is oldest, send to the api 'title:desc'
  //if the option is oldest, send to the api 'soonest:asc'
  //if the option is oldest, send to the api 'soonest:desc'
  //update searchService searchPosts.


  // if user clicks discover tab again it will reload default discover page state.
  useEffect(() => {
     setSearchText(initialSearchText);
     setPage(initialPage);
     setGames(initialGames);
     setTags(initialTags);
     setAscDsc(initialAscDscs);
   }, [location.search]);

  // function for search submissions
  const searchSubmit = (newSearchText) => {
    setSearchText(newSearchText);
    setPage(1); // reset to page 1 on new search
  };
  
  // handle filter changes
const handleFilterChange = (newGames, newTags, newAscDsc) => {
  setGames(newGames);
  setTags(newTags);
  setAscDsc(newAscDsc);
  setPage(1); // Reset to page 1 when filters change
};

  const handlePageChange = (event, value) => {
    setPage(value);
    const params = new URLSearchParams(location.search);
    params.set('page', value);
    navigate(`/discover?${params.toString()}`);
  };  

  useEffect(() => {
    // build query string
    const params = new URLSearchParams();
    if (searchText) params.append('q', searchText);
    if (page > 1) params.set('page', page);
    games.forEach(game => params.append('game', game.id));
    tags.forEach(tag => params.append('tag', tag.id));
    ascDscs.forEach(ascDsc => params.append('ascDsc', ascDsc.id));

    // update URL(only show page in URL if page > 1)
    navigate(`/discover${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
  }, [searchText, page, games, tags, sortOption, navigate]);

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: 'left', minWidth: '200pt',  maxWidth:'300px'  }}>
        <Typography variant="h5">Filters</Typography>
        <GamesSelector onChange={(e, v) => handleFilterChange(v, tags)} />
        <TagsSelector onChange={(e, v) => handleFilterChange(v, games)} />
        <AscDscSelector onChange={(e, v) => handleFilterChange(v, sortOption)} />
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
