import {
  Select,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import UserService from '../../services/userService';
import RelationService from '../../services/relationService';
import Posts from '../Posts';
import Users from '../Users';
import './Social.css';
import { useSearchParams } from 'react-router-dom';
import UserContext from '../../context/userContext';
import TextSearch from '../TextSearch';

export default function Social() {
  var tabOptions = {
    Posts: 'Posts',
    Users: 'Users',
  };

  var relationOptions = {
    Friends: 'Friends',
    Pending: 'Pending',
    Requested: 'Requested',
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('o') || tabOptions.Posts;
  const initialRelation = searchParams.get('r') || relationOptions.Friends;
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tabOption, setTabOption] = useState(initialTab);
  const [relationOption, setRelationOption] = useState(initialRelation);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadContent = async () => {
      if (tabOption === tabOptions.Posts) {
        var query = {
          limit: 100,
          keyword: searchText,
        };
 
        UserService.getConnectedPosts(query).then(setPosts);
      } else {
        RelationService.getRelations(user.id, relationOption).then(setUsers);
      }
    };
    loadContent();
  }, [tabOption, searchText, relationOption, user.id, tabOptions.Posts]);

  // use effect to update search params
  useEffect(() => {
    const updateSearchParams = () => {
      setSearchParams((params) => {
        if (searchText) {
          params.set('q', searchText);
        }
        params.set('o', tabOption);
        if (tabOption === tabOptions.Posts) {
          params.delete('r');
        } else {
          params.set('r', relationOption);
        }
        return params;
      }, { replace: true });
    };

    const updateSearchResults = async () => {
      if (tabOption === tabOptions.Posts) {
        const query = {
          keywords: searchText,
        };

        const response = await UserService.getConnectedPosts(query);
        setPosts(response);
      } else {
        const query = {
          keywords: searchText,
        };
        const response = await RelationService.getRelations(user.id, relationOption, query);
        setUsers(response);
      }
    };
    
    const submitSearch = async () => {
      updateSearchParams();
      updateSearchResults();
    };

    submitSearch();
  }, [tabOption, relationOption, tabOptions.Posts, searchText, setSearchParams]);

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
          <InputLabel id="social-option-label">Associated</InputLabel>
          <Select
            labelId="social-option-label"
            value={tabOption}
            label="Associated"
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
    <div>
    <div className="page-header">
      <Typography variant="h3" style={{ color: '#FFF' }}>
        Associated {tabOption}
      </Typography>
      </div>
      <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {renderTabSelectors()}
        <TextSearch.SearchBar searchText={searchText} onSearchSubmit={setSearchText} />
      </div>
      <div className="page-content">
      {renderTabContent()}
      </div>
    </div>
  </div>
  );

}
