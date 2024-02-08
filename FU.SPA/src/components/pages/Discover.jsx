import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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

const paramToDayjs = (searchParams, paramKey) => {
  let endTimeParam = searchParams.get(paramKey);
  if (!endTimeParam || !dayjs(endTimeParam).isValid()) return null;
  return dayjs(endTimeParam);
};

export default function Discover() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [games, setGames] = useState([]);
  const [tags, setTags] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [startDate, setStartDate] = useState(
    paramToDayjs(searchParams, 'startDate'),
  );
  const [endDate, setEndDate] = useState(paramToDayjs(searchParams, 'endDate'));
  const [startTime, setStartTime] = useState(
    paramToDayjs(searchParams, 'startTime'),
  );
  const [endTime, setEndTime] = useState(paramToDayjs(searchParams, 'endTime'));

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
        if (startTime) params.set('startTime', startTime.toISOString());
        if (endTime) params.set('endTime', endTime.toISOString());
        return params;
      },
      { replace: true },
    );
  }, [startDate, endDate, startTime, endTime, setSearchParams]);

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
        <SelectTimeRange
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={(newValue) => setStartTime(newValue)}
          onEndTimeChange={(newValue) => setEndTime(newValue)}
        />
      </div>
      <div>
        <SearchBar onSearchSubmit={setSearchText} />
        <Posts posts={posts} />
      </div>
    </div>
  );
}

function SelectTimeRange({
  onStartTimeChange,
  onEndTimeChange,
  startTime,
  endTime,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="From"
        value={startTime}
        onChange={(newValue) => onStartTimeChange(newValue)}
      />
      <TimePicker
        label="To"
        value={endTime}
        onChange={(newValue) => onEndTimeChange(newValue)}
      />
    </LocalizationProvider>
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
