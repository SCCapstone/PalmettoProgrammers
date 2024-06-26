import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { Typography, Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import { TagsSelector, GamesSelector, SortOptionsSelector } from '../Selectors';
import SearchService from '../../services/searchService';
import GameService from '../../services/gameService';
import TagService from '../../services/tagService';
import Posts from '../Posts';
import Users from '../Users';
import {
  DateFilterRadioValues,
  SelectDateRangeFilter,
  SelectTimeRangeFilter,
  SelectTimeRangeRadioValues,
} from './Filters';
import './Discover.css';
import TextSearch from '../TextSearch';
import config from '../../config';
import SearchResults from '../SearchResults';

const paramKey = {
  endDate: 'endDate',
  startDate: 'startDate',
  dateRadio: 'dateRadio',
  endTime: 'endTime',
  startTime: 'startTime',
  timeRadio: 'timeRadio',
  games: 'games',
  tags: 'tags',
  page: 'page',
  postSort: 'psort',
  userSort: 'usort',
};

// Converts a search paramater to its dayjs equivalent
const paramToDayjs = (searchParams, paramKey) => {
  let paramValue = searchParams.get(paramKey);
  if (!paramValue || !dayjs(paramValue).isValid()) return undefined;
  return dayjs(paramValue);
};

export default function Discover() {
  var tabOptions = {
    Posts: 'Posts',
    Users: 'Users',
  };

  // STATE VARIABLES START
  const queryLimit = 12;
  const [totalResults, setTotalResults] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('o') || tabOptions.Posts;

  const [tabOption, setTabOption] = useState(initialTab);
  const [players, setPlayers] = useState([]);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(
    parseInt(searchParams.get(paramKey.page), 10) || 1,
  );

  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const [games, setGames] = useState(
    searchParams
      .get(paramKey.games)
      ?.split(',')
      .map((id) => ({ id })) ?? [],
  );
  const [tags, setTags] = useState(
    searchParams
      .get(paramKey.tags)
      ?.split(',')
      .map((id) => ({ id })) ?? [],
  );
  const [gameOptions, setGameOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  const [postSortOption, setPostSortOption] = useState(
    searchParams.get(paramKey.postSort) ||
      config.POST_SORT_OPTIONS[1].value + ':asc',
  );
  const [userSortOption, setUserSortOption] = useState(
    searchParams.get(paramKey.userSort) || null,
  );

  const [dateRangeRadioValue, setDateRangeRadioValue] = useState(() => {
    const paramValue = searchParams.get(paramKey.dateRadio);
    if (
      paramValue === DateFilterRadioValues.upcoming ||
      paramValue === DateFilterRadioValues.between
    )
      return paramValue;
    else return DateFilterRadioValues.upcoming;
  });
  const [startDate, setStartDate] = useState(
    paramToDayjs(searchParams, paramKey.startDate) || null,
  );
  const [endDate, setEndDate] = useState(
    paramToDayjs(searchParams, paramKey.endDate) || null,
  );
  const [timeRangeRadioValue, setTimeRangeRadioValue] = useState(() => {
    const paramValue = searchParams.get(paramKey.timeRadio);
    if (
      paramValue === SelectTimeRangeRadioValues.any ||
      paramValue === SelectTimeRangeRadioValues.between
    )
      return paramValue;
    else return SelectTimeRangeRadioValues.any;
  });
  const [startTime, setStartTime] = useState(
    paramToDayjs(searchParams, paramKey.startTime),
  );
  const [endTime, setEndTime] = useState(
    paramToDayjs(searchParams, paramKey.endTime),
  );
  // STATE VARIABLES END

  // useEffect to update search params
  useEffect(() => {
    const updateSearchParams = async () => {
      setSearchParams(
        (params) => {
          /* This large block sets the search paramters for a query
           * Also handles error checking so that invalid params cannot
           * be included
           */
          if (
            dateRangeRadioValue === DateFilterRadioValues.between &&
            startDate?.isValid()
          )
            params.set(paramKey.startDate, startDate.toISOString());
          else params.delete(paramKey.startDate);

          if (
            dateRangeRadioValue === DateFilterRadioValues.between &&
            endDate?.isValid()
          )
            params.set(paramKey.endDate, endDate.toISOString());
          else params.delete(paramKey.endDate);

          if (dateRangeRadioValue)
            params.set(paramKey.dateRadio, dateRangeRadioValue);

          if (startTime?.isValid())
            params.set(paramKey.startTime, startTime.toISOString());
          else params.delete(paramKey.startTime);

          if (endTime?.isValid())
            params.set(paramKey.endTime, endTime.toISOString());
          else params.delete(paramKey.endTime);

          if (timeRangeRadioValue)
            params.set(paramKey.timeRadio, timeRangeRadioValue);

          if (searchText) params.set('q', searchText);

          params.set(paramKey.page, page.toString());
          if (page === 1) params.delete(paramKey.page);

          if (games.length > 0) {
            // set games and tags with comma separated values
            const gameIds = games.map((game) => game.id.toString()).join(',');
            params.set(paramKey.games, gameIds);
          } else {
            params.delete(paramKey.games);
          }
          if (tags.length > 0) {
            const tagIds = tags.map((tag) => tag.id.toString()).join(',');
            params.set(paramKey.tags, tagIds);
          } else {
            params.delete(paramKey.tags);
          }
          if (tabOption === tabOptions.Posts) {
            params.set('o', tabOption);
          } else {
            params.set('o', tabOption);
          }

          if (postSortOption) {
            params.set(paramKey.postSort, postSortOption);
          }

          if (userSortOption) {
            params.set(paramKey.userSort, userSortOption);
          }

          if (tabOption === tabOptions.Posts) {
            params.delete(paramKey.userSort);
          } else {
            params.delete(paramKey.postSort);
          }

          return params;
        },
        { replace: true },
      );
    };

    const updateSearchResults = async () => {
      if (tabOption === tabOptions.Posts) {
        const query = {
          keywords: searchText,
          games: games,
          tags: tags,
          limit: queryLimit,
          page: page,
          sort: postSortOption,
        };

        if (startDate) query.startDate = startDate;
        if (endDate) query.endDate = endDate;

        // Set start date to today if upcoming is selected
        if (dateRangeRadioValue === DateFilterRadioValues.upcoming)
          query.startDate = dayjs();

        // We only care about start/end time if radio value is 'between'
        if (timeRangeRadioValue === SelectTimeRangeRadioValues.between) {
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
        }

        // Search and set posts
        const response = await SearchService.searchPosts(query);
        setPosts(response.data);
        setTotalResults(response.totalCount);
      } else {
        // on User tab
        const query = {
          keywords: searchText,
          limit: queryLimit,
          page: page,
          sort: userSortOption,
        };

        // Search and set users
        const response = await SearchService.searchUsers(query);
        setPlayers(response.data);
        setTotalResults(response.totalCount);
      }
    };

    const submitSearch = async () => {
      updateSearchParams();
      updateSearchResults();
    };

    submitSearch();
    // disable for setSearchParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    games,
    tags,
    page,
    searchText,
    dateRangeRadioValue,
    startDate,
    endDate,
    timeRangeRadioValue,
    startTime,
    endTime,
    tabOption,
    postSortOption,
    userSortOption,
  ]);

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

  useEffect(() => {
    const gamesString = searchParams.get(paramKey.games);
    const tagsString = searchParams.get(paramKey.tags);

    const gameIds = gamesString ? gamesString.split(',') : [];
    const tagIds = tagsString ? tagsString.split(',') : [];

    const restoredGames = gameIds.map(
      (gameId) =>
        gameOptions.find((game) => game.id.toString() === gameId) || {
          id: gameId,
        },
    );

    const restoredTags = tagIds.map(
      (tagId) =>
        tagOptions.find((tag) => tag.id.toString() === tagId) || { id: tagId },
    );

    setGames(restoredGames);
    setTags(restoredTags);
  }, [searchParams, gameOptions, tagOptions]);

  // Method for adding a tag id to the search
  const onTagClick = (tagTitle) => {
    const tag = tagOptions.find((tag) => tag.name === tagTitle);
    if (tag && !tags.some((t) => t.name === tag.name)) {
      setTags([...tags, tag]);
      setPage(1);
    }
  };

  // Render posts or users based on tab option selected
  const renderTabContent = () => {
    if (tabOption === tabOptions.Posts) {
      return (
        <Posts posts={posts} onTagClick={onTagClick} showJoinedStatus={true} />
      );
    } else if (tabOption === tabOptions.Users) {
      return <Users users={players} showRelationStatus={true} />;
    }
  };

  // Displays post sort selector for sort options
  const renderPostSortSelector = () => {
    return (
      <SortOptionsSelector
        initialValue={postSortOption}
        options={config.POST_SORT_OPTIONS}
        onChange={(newValue) => {
          setPostSortOption(newValue);
          setPage(1);
        }}
      />
    );
  };

  // Displays user sort selector for sort options
  const renderUserSortSelector = () => {
    return (
      <SortOptionsSelector
        initialValue={userSortOption}
        options={config.USER_SORT_OPTIONS}
        onChange={(newValue) => {
          setUserSortOption(newValue);
          setPage(1);
        }}
      />
    );
  };

  // Displays tab options, currently for posts or users
  const renderTabSelectors = () => {
    return (
      <Tabs
        value={tabOption}
        onChange={(_, newValue) => {
          setTabOption(newValue);
          setPage(1);
        }}
        variant="fullWidth"
      >
        <Tab label={tabOptions.Posts} value={tabOptions.Posts} />
        <Tab label={tabOptions.Users} value={tabOptions.Users} />
      </Tabs>
    );
  };

  // Display page
  return (
    <div className="page-content">
      <div
        className="sidebar"
        style={{
          textAlign: 'left',
          width: '200pt',
          maxWidth: '300px',
          minWidth: '200pt',
        }}
      >
        {renderTabSelectors()}
        {tabOption === tabOptions.Posts && (
          <>
            <Typography variant="h5" style={{ color: '#FFF' }}>
              Filters
            </Typography>

            <GamesSelector
              value={games}
              onChange={(_, newGames) => {
                setPage(1);
                setGames(newGames);
              }}
              onKeyDown={(event, newGames) => {
                if (event.key === 'Enter') {
                  event.defaultMuiprevented = true;
                  setPage(1);
                  setGames(newGames);
                }
              }}
              options={gameOptions}
            />
            <TagsSelector
              value={tags}
              onChange={(_, newTags) => {
                setPage(1);
                setTags(newTags);
              }}
              onKeyDown={(event, newTags) => {
                if (event.key === 'Enter') setPage(1);
                setGames(newTags);
              }}
            />
            <SelectDateRangeFilter
              initialRadioValue={dateRangeRadioValue}
              initialStartDateValue={startDate}
              initialEndDateValue={endDate}
              onChange={(newValues) => {
                setStartDate(newValues.startDate);
                setEndDate(newValues.endDate);
                setDateRangeRadioValue(newValues.radioValue);
                setPage(1);
              }}
            />
            <SelectTimeRangeFilter
              initialRadioValue={timeRangeRadioValue}
              initialStartTimeValue={startTime}
              initialEndTimeValue={endTime}
              onTimeRangeChange={(newValues) => {
                setStartTime(newValues.startTime);
                setEndTime(newValues.endTime);
                setTimeRangeRadioValue(newValues.radioValue);
                setPage(1);
              }}
            />
          </>
        )}
      </div>
      <div>
        <div style={{ display: 'flex', gap: '50px', justifyContent: 'center' }}>
          <TextSearch.SearchBar
            searchText={searchText}
            onSearchSubmit={(newSearchText) => {
              setSearchText(newSearchText);
              setPage(1);
            }}
          />
          {tabOption === tabOptions.Posts && renderPostSortSelector()}
          {tabOption === tabOptions.Users && renderUserSortSelector()}
        </div>
        {renderTabContent()}
        <div
          style={{
            display: 'flex',
            color: 'violet',
            justifyContent: 'center',
            marginTop: '20px',
            marginRight: '150px',
          }}
        >
          <SearchResults
            page={page}
            count={Math.ceil(totalResults / queryLimit)}
            totalResults={totalResults}
            queryLimit={queryLimit}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
