import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TagsSelector, GamesSelector } from '../Selectors';
import SearchService from '../../services/searchService';
import Posts from '../Posts';
import './Discover.css';

export default function Discover() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [games, setGames] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [startDate, setStartDate] = useState(() => {
    let startDateParam = searchParams.get('startDate');
    if (startDateParam) return dayjs(startDateParam);
    else return null;
  });
  const [endDate, setEndDate] = useState(() => {
    let endDateParam = searchParams.get('endDate');
    if (endDateParam) return dayjs(endDateParam);
    else return null;
  });

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

  // Update search params when startDate or endDate is updated
  useEffect(() => {
    setSearchParams(
      (params) => {
        if (startDate) params.set('startDate', startDate.toISOString());
        if (endDate) params.set('endDate', endDate.toISOString());
        return params;
      },
      { replace: true },
    );
  }, [startDate, endDate, setSearchParams]);

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: 'left', minWidth: '200pt' }}>
        <Typography variant="h5">Filters</Typography>
        <GamesSelector onChange={(e, v) => setGames(v)} />
        <TagsSelector onChange={(e, v) => setTags(v)} />
        <SelectDateRange
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(newValue) => setStartDate(newValue)}
          onEndDateChange={(newValue) => setEndDate(newValue)}
        />
      </div>
      <div>
        <SearchBar onSearchSubmit={setSearchText} />
        <Posts posts={posts} />
      </div>
    </div>
  );
}

function SelectDateRange({
  onStartDateChange,
  onEndDateChange,
  startDate,
  endDate,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="From"
        value={startDate}
        onChange={(newValue) => onStartDateChange(newValue)}
      />
      <DatePicker
        label="To"
        value={endDate}
        onChange={(newValue) => onEndDateChange(newValue)}
      />
    </LocalizationProvider>
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
