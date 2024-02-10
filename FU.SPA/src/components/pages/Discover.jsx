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

      if (startDate?.isValid()) query.startDate = startDate;
      if (endDate?.isValid()) query.endDate = endDate;

      if (startTime?.isValid()) {
        query.startTime = startTime;

        if (!endTime?.isValid()) {
          // set end time to 23:59:59 if unset
          query.endTime = new Date();
          query.endTime.setHours(23, 59, 59);
        }
      }
      if (endTime?.isValid()) {
        query.endTime = endTime;

        if (!endTime?.isValid()) {
          // set start time to 00:00:00 if unset
          query.startTime = new Date();
          query.startTime.setHours(0, 0, 0);
        }
      }

      const response = await SearchService.searchPosts(query);
      setPosts(response);
    };
    submitSearch();
  }, [games, tags, searchText, startDate, endDate, startTime, endTime]);

  // Update search params when startDate or endDate is updated
  useEffect(() => {
    setSearchParams(
      (params) => {
        if (startDate?.isValid())
          params.set('startDate', startDate.toISOString());
        if (endDate?.isValid()) params.set('endDate', endDate.toISOString());
        if (startTime?.isValid())
          params.set('startTime', startTime.toISOString());
        if (endTime?.isValid()) params.set('endTime', endTime.toISOString());
        return params;
      },
      { replace: true },
    );
  }, [startDate, endDate, startTime, endTime, setSearchParams]);

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: 'left', width: '200pt' }}>
        <Typography variant="h5">Filters</Typography>
        <GamesSelector onChange={(e, v) => setGames(v)} />
        <TagsSelector onChange={(e, v) => setTags(v)} />
        <SelectDateRange
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(newValue) => {
            if (endDate && newValue && newValue > endDate) setEndDate(null);
            setStartDate(newValue);
          }}
          onEndDateChange={(newValue) => {
            if (startDate && newValue && newValue < startDate)
              setStartDate(null);
            setEndDate(newValue);
          }}
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
        slotProps={{ field: { clearable: true } }}
      />
      <TimePicker
        label="To"
        value={endTime}
        onChange={(newValue) => onEndTimeChange(newValue)}
        slotProps={{ field: { clearable: true } }}
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
        slotProps={{ field: { clearable: true } }}
      />
      <DatePicker
        label="To"
        value={endDate}
        onChange={(newValue) => onEndDateChange(newValue)}
        slotProps={{ field: { clearable: true } }}
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
