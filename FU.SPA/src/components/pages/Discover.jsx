import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TagsSelector, GamesSelector } from '../Selectors';
import SearchService from '../../services/searchService';
import Posts from '../Posts';
import { SelectDateRangeFilter, SelectTimeRangeFilter } from './Filters';
import './Discover.css';

export default function Discover() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [games, setGames] = useState([]);
  const [tags, setTags] = useState([]);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);

  useEffect(() => {
    const submitSearch = async () => {
      // if values haven't been loaded don't search
      // this prevents an erronious search from occuring and causing flicker on the initial page load
      if (
        startDate === undefined ||
        endDate === undefined ||
        startTime === undefined ||
        endTime === undefined
      )
        return;

      const query = {
        keywords: searchText,
        games: games,
        tags: tags,
      };

      if (startDate) query.startDate = startDate;
      if (endDate) query.endDate = endDate;

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

        if (!startTime?.isValid()) {
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

  return (
    <div className="page-content">
      <div className="sidebar" style={{ textAlign: 'left', width: '200pt' }}>
        <Typography variant="h5">Filters</Typography>
        <GamesSelector onChange={(e, v) => setGames(v)} />
        <TagsSelector onChange={(e, v) => setTags(v)} />
        <SelectDateRangeFilter
          onDateRangeChange={(newRange) => {
            setStartDate(newRange.startDate);
            setEndDate(newRange.endDate);
          }}
        />
        <SelectTimeRangeFilter
          onTimeRangeChange={(newRange) => {
            setStartTime(newRange.startTime);
            setEndTime(newRange.endTime);
          }}
        />
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
