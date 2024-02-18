import { Typography, InputAdornment, Pagination } from '@mui/material';
import { TagsSelector, GamesSelector } from '../Selectors';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Discover.css';
import Players from '../Players';
import {
    CustomTextField,
    CustomTimePicker,
    CustomDatePicker,
  } from '../../helpers/styleComponents';

const PlayerDiscover = () => { 
    const postsPerPage = 10; // limit of posts on a page(increase later, low for testing)
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearchText = searchParams.get('q') || '';
    const initialPage = parseInt(searchParams.get('page'), 10) || 1;
    const [page, setPage] = useState(initialPage);
    const [searchText, setSearchText] = useState(initialSearchText);
    const [players, setplayers] = useState([]);


    const lastPost = page * postsPerPage;
  // index of first
  const firstPost = lastPost - postsPerPage;

  // each page has correct number of posts
  const currentPlayers = players.slice(firstPost, lastPost);


     // function for search submissions
  const searchSubmit = (newSearchText) => {
    setSearchText(newSearchText);
    setPage(1); // reset to page 1 on new search
  };


return (
    <div className="page-content">
      <div
        className="sidebar"
        style={{
          textAlign: 'left',
          width: '200pt',
          maxWidth: '300px',
          minWidth: '190pt',
        }}
      >
        <Typography variant="h5" style={{ color: '#FFF' }}>
          Filters
        </Typography>
        <GamesSelector
        />
        <TagsSelector
        />
      </div>
      <div>
        <SearchBar searchText={searchText} onSearchSubmit={searchSubmit} />
        <Players players={currentPlayers} />
        <div
          style={{
            display: 'flex',
            color: 'violet',
            justifyContent: 'center',
            marginTop: '20px',
            marginRight: '150px',
          }}
        >
          <Stack spacing={2}>
            <Typography>Page: {page}</Typography>
            <Pagination
              count={Math.ceil(players.length / postsPerPage)}
              page={page}
              //onChange={handlePageChange}
              color="secondary"
            />
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
        <CustomTextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={localSearchText}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M6.30281 0H6.3047V0.000757268C7.93544 0.00118999 9.41208 0.60668 10.4807 1.58507C11.5475 2.56206 12.2083 3.91259 12.2094 5.40419H12.2102V5.40776V5.41209H12.2094C12.2088 6.01325 12.101 6.5918 11.9028 7.1313C11.8696 7.22185 11.8349 7.30883 11.7992 7.39191V7.39267C11.6283 7.78861 11.4074 8.16292 11.1436 8.50769L14.5805 11.3354L14.5826 11.3372L14.6012 11.353L14.6025 11.3542C14.7965 11.5232 14.9022 11.7497 14.9155 11.9794C14.9285 12.2066 14.8514 12.439 14.6817 12.6254L14.6804 12.6271L14.6597 12.6491L14.6556 12.6529L14.6383 12.6702L14.6364 12.6725C14.4515 12.8501 14.2046 12.9466 13.9533 12.9587C13.7055 12.9707 13.4514 12.9003 13.2477 12.7447L13.2459 12.7435L13.2218 12.7246L13.2184 12.722L9.70316 9.82988C9.59916 9.89696 9.49304 9.96068 9.38561 10.0208C9.2399 10.1025 9.08898 10.1794 8.935 10.2496C8.14332 10.6112 7.24871 10.8145 6.30292 10.8145V10.8153H6.30103V10.8145C4.67029 10.8141 3.19341 10.2086 2.12484 9.23024C1.05769 8.25325 0.397185 6.9025 0.396121 5.41133H0.395294V5.40776V5.40603H0.396121C0.396594 3.91324 1.05804 2.5613 2.12685 1.58312C3.19412 0.60668 4.66946 0.0017309 6.29891 0.000757268V0H6.30281ZM6.3047 1.21271V1.21347H6.30281H6.29891V1.21271C5.03605 1.21347 3.89137 1.6833 3.0627 2.44154C2.23415 3.19978 1.72043 4.24871 1.72008 5.40614H1.7209V5.40787V5.41144H1.72008C1.7209 6.56746 2.2338 7.61477 3.06247 8.37355C3.89078 9.13212 5.03664 9.60238 6.30091 9.6026V9.60184H6.30281H6.30671V9.6026C7.56956 9.60184 8.71377 9.13222 9.54267 8.37376C10.3712 7.61552 10.8849 6.56692 10.8852 5.4096H10.8845V5.40787V5.4043H10.8852C10.8845 4.24828 10.3711 3.20043 9.54291 2.44187C8.71459 1.6833 7.56909 1.21304 6.3047 1.21271Z"
                    fill="white"
                  />
                </svg>
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

  export default PlayerDiscover;