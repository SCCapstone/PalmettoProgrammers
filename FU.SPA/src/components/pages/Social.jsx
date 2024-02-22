import { Select, Typography, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import UserService from '../../services/userService';
import RelationService from '../../services/relationService';
import Posts from '../Posts';
import Users from '../Users';
import './Social.css';
import { useSearchParams } from 'react-router-dom';
import UserContext from '../../context/userContext';

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

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tabOption, setTabOption] = useState(initialTab);
  const [relationOption, setRelationOption] = useState(initialRelation);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadContent = async () => {
      if (tabOption === tabOptions.Posts) {
        // Pass in empty object for later query parameters
        var query = {
          limit: 100,
        };
        UserService.getConnectedPosts(query).then(setPosts);
      } else {
        RelationService.getRelations(user.id, relationOption).then(setUsers);
      }
    };
    loadContent();
  }, [tabOption, relationOption, user.id, tabOptions.Posts]);

  // use effect to update search params
  useEffect(() => {
    if (tabOption === tabOptions.Posts) {
      setSearchParams({ o: tabOption });
    } else {
      setSearchParams({ o: tabOption, r: relationOption });
    }
  }, [tabOption, relationOption, tabOptions.Posts, setSearchParams]);

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
      <Typography variant="h3" style={{ color: '#FFF', textAlign: 'left' }}>
        Associated {tabOption}
      </Typography>
      {renderTabSelectors()}
      {renderTabContent()}
    </div>
  );
}
