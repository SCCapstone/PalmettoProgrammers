import {
  Select,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { useEffect, useState, useContext } from 'react';
import UserService from '../../services/userService';
import RelationService from '../../services/relationService';
import Posts from '../Posts';
import Users from '../Users';
import './Social.css';
import { useSearchParams } from 'react-router-dom';
import UserContext from '../../context/userContext';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get(paramKey.tabOption) || tabOptions.Posts;
  const initialRelation =
    searchParams.get(paramKey.relationOption) || relationOptions.Friends;
  const initialPage = searchParams.get(paramKey.page) || 1;

  const queryLimit = 10;
  const [totalResults, setTotalResults] = useState(0);

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tabOption, setTabOption] = useState(initialTab);
  const [relationOption, setRelationOption] = useState(initialRelation);
  const [page, setPage] = useState(initialPage);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadContent = async () => {
      if (tabOption === tabOptions.Posts) {
        // Pass in empty object for later query parameters
        const query = {
          limit: queryLimit,
          page: page,
        };
        const response = await UserService.getConnectedPosts(query);
        setPosts(response.data);
        setTotalResults(response.totalCount);
      } else {
        const query = {
          relation: relationOption,
          limit: queryLimit,
          page: page,
        };
        const response = await RelationService.getRelations(user.id, query);
        setUsers(response.data);
        setTotalResults(response.totalCount);
      }
    };
    loadContent();
  }, [tabOption, relationOption, user.id, page]);

  // use effect to update search params
  useEffect(() => {
    if (tabOption === tabOptions.Posts) {
      setSearchParams({ o: tabOption, page: page });
    } else {
      setSearchParams({ o: tabOption, r: relationOption, page: page });
    }
  }, [tabOption, relationOption, setSearchParams, page]);

  // Go to page 1 when we change the tab option
  useEffect(() => {
    setPage(1);
  }, [tabOption]);

  const renderTabContent = () => {
    if (tabOption === tabOptions.Posts) {
      return <Posts posts={posts} />;
    } else {
      return <Users users={users} />;
    }
  };

  const renderTabSelectors = () => {
    return (
      <div className="selectors-wrapper">
        <FormControl>
          <InputLabel id="social-option-label">Social</InputLabel>
          <Select
            labelId="social-option-label"
            value={tabOption}
            label="Social"
            onChange={(e) => setTabOption(e.target.value)}
          >
            {Object.keys(tabOptions).map((option, index) => (
              <MenuItem key={index} value={tabOptions[option]}>
                {tabOptions[option]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {tabOption === tabOptions.Users && (
          <FormControl>
            <InputLabel id="status-selector-label">Relation Status</InputLabel>
            <Select
              labelId="status-selector-label"
              label="Relation Status"
              value={relationOption}
              onChange={(e) => setRelationOption(e.target.value)}
              style={{ minWidth: '150px', textAlign: 'left' }}
            >
              {Object.keys(relationOptions).map((option, index) => (
                <MenuItem key={index} value={relationOptions[option]}>
                  {relationOptions[option]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    );
  };

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
          <Stack spacing={2}>
            <Typography>Page: {page}</Typography>
            <Pagination
              count={Math.ceil(totalResults / queryLimit)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="secondary"
            />
          </Stack>
        </div>
      </div>
    </div>
  );
}
