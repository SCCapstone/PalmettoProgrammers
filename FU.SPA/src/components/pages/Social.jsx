import { Tabs, Tab, ButtonGroup, Button } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import UserService from '../../services/userService';
import RelationService from '../../services/relationService';
import Posts from '../Posts';
import Users from '../Users';
import './Social.css';
import { useSearchParams } from 'react-router-dom';
import UserContext from '../../context/userContext';
import TextSearch from '../TextSearch';
import SearchResults from '../SearchResults';
import { SortOptionsSelector } from '../Selectors';
import config from '../../config';

const paramKey = {
  tabOption: 'o',
  relationOption: 'r',
  page: 'page',
};

const tabOptions = {
  Posts: 'Posts',
  Users: 'Users',
};

const relationOptions = {
  Friends: 'Friends',
  Pending: 'Pending',
  Requested: 'Requested',
};

export default function Social() {
  // STATE VARIABLES START
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get(paramKey.tabOption) || tabOptions.Posts;
  const initialRelation =
    searchParams.get(paramKey.relationOption) || relationOptions.Friends;
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const initialPage = parseInt(searchParams.get(paramKey.page), 10) || 1;

  const queryLimit = 12;
  const [totalResults, setTotalResults] = useState(0);

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tabOption, setTabOption] = useState(initialTab);
  const [relationOption, setRelationOption] = useState(initialRelation);
  const [page, setPage] = useState(initialPage);

  const [postSortOption, setPostSortOption] = useState(
    searchParams.get('psort') ||
      config.SOCIAL_POST_SORT_OPTIONS[1].value + ':asc',
  );
  const [userSortOption, setUserSortOption] = useState(
    searchParams.get('usort') ||
      config.SOCIAL_USER_SORT_OPTIONS[2].value + ':desc',
  );

  const { user } = useContext(UserContext);
  // STATE VARIABLES END

  // useEffect to update search params
  useEffect(() => {
    const updateSearchParams = () => {
      setSearchParams(
        (params) => {
          if (searchText) {
            params.set('q', searchText);
          }
          params.set('o', tabOption);
          params.set('page', page);

          if (postSortOption) {
            params.set('psort', postSortOption);
          }

          if (userSortOption) {
            params.set('usort', userSortOption);
          }

          if (tabOption === tabOptions.Posts) {
            params.delete('r');
            params.delete('usort');
          } else {
            params.set('r', relationOption);
            params.delete('psort');
          }
          return params;
        },
        { replace: true },
      );
    };

    // function that updates search results depending on tab
    const updateSearchResults = async () => {
      if (tabOption === tabOptions.Posts) {
        const query = {
          keywords: searchText,
          limit: queryLimit,
          page: page,
          sort: postSortOption,
        };

        try {
          const response = await UserService.getConnectedPosts(query);
          setPosts(response.data);
          setTotalResults(response.totalCount);
        } catch (error) {
          console.error('Error', error);
        }
      } else {
        const query = {
          keywords: searchText,
          relation: relationOption,
          limit: queryLimit,
          page: page,
          sort: userSortOption,
        };
        try {
          const response = await RelationService.getRelations(user.id, query);
          setUsers(response.data);
          setTotalResults(response.totalCount);
        } catch (error) {
          console.error('Error', error);
        }
      }
    };

    const submitSearch = async () => {
      updateSearchParams();
      updateSearchResults();
    };

    submitSearch();
  }, [
    tabOption,
    relationOption,
    searchText,
    user.id,
    setSearchParams,
    page,
    postSortOption,
    userSortOption,
  ]);

  // Renders either posts or users components based on tab
  const renderTabContent = () => {
    if (tabOption === tabOptions.Posts) {
      return <Posts posts={posts} showJoinedStatus={false} />;
    } else {
      return <Users users={users} showRelationStatus={false} />;
    }
  };

  const renderPostSortOptions = () => {
    return (
      <SortOptionsSelector
        initialValue={postSortOption}
        options={config.SOCIAL_POST_SORT_OPTIONS}
        onChange={(newValue) => {
          console.log(newValue);
          setPostSortOption(newValue);
          setPage(1);
        }}
      />
    );
  };

  const renderUserSortOptions = () => {
    return (
      <SortOptionsSelector
        initialValue={userSortOption}
        options={config.SOCIAL_USER_SORT_OPTIONS}
        onChange={(newValue) => {
          console.log(newValue);
          setUserSortOption(newValue);
          setPage(1);
        }}
      />
    );
  };

  const renderRelationButtons = () => {
    return (
      <ButtonGroup orientation="vertical">
        {Object.keys(relationOptions).map((option, index) => (
          <Button
            key={index}
            variant={
              relationOption === relationOptions[option]
                ? 'contained'
                : 'outlined'
            }
            onClick={() => {
              setRelationOption(relationOptions[option]);
              setPage(1);
            }}
          >
            {relationOptions[option]}
          </Button>
        ))}
      </ButtonGroup>
    );
  };

  const renderTabSelectors = () => {
    return (
      <>
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
        {tabOption === tabOptions.Users && renderRelationButtons()}
      </>
    );
  };

  // Display component
  return (
    <div className="page-content">
      <div
        className="sidebar"
        style={{
          textAlign: 'left',
          width: 'auto',
          maxWidth: '200px',
        }}
      >
        {renderTabSelectors()}
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
          {tabOption === tabOptions.Posts && renderPostSortOptions()}
          {tabOption === tabOptions.Users && renderUserSortOptions()}
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
