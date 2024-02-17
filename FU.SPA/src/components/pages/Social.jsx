import { Typography, MenuItem } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import UserService from '../../services/userService';
import RelationService from '../../services/relationService';
import Posts from '../Posts';
import Users from '../Users';
import './Social.css';
import { useSearchParams } from 'react-router-dom';
import { CustomSelect } from '../../helpers/styleComponents';
import UserContext from '../../context/userContext';

export default function Social() {
  var tabOptions = ['Posts', 'Users'];
  var relationOptions = ['Friends', 'Pending', 'Requested'];

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('o') || tabOptions[0];
  const initialRelation = searchParams.get('r') || relationOptions[0];

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tabOption, setTabOption] = useState(initialTab);
  const [relationOption, setRelationOption] = useState(initialRelation);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadContent = async () => {
      if (tabOption === 'Posts') {
        // Pass in empty object for later query parameters
        var query = {
          limit: 100,
        };
        UserService.getConnectedPosts(query).then(setPosts);
      } else if (tabOption === 'Users') {
        RelationService.getRelations(user.id, relationOption).then(setUsers);
      }
    };
    loadContent();
  }, [tabOption, relationOption, user.id]);

  // use effect to update search params
  useEffect(() => {
    if (tabOption === 'Posts') {
      setSearchParams({ o: tabOption });
    } else {
      setSearchParams({ o: tabOption, r: relationOption });
    }
  }, [tabOption, relationOption, setSearchParams]);

  const renderTabContent = () => {
    if (tabOption === tabOptions[0]) {
      return <Posts posts={posts} />;
    } else {
      return <Users users={users} />;
    }
  };

  const renderTabSelectors = () => {
    return (
      <div className="selectors-wrapper">
        <CustomSelect
          value={tabOption}
          onChange={(e) => setTabOption(e.target.value)}
        >
          {tabOptions.map((option, index) => (
            <MenuItem key={index} value={option}>{option}</MenuItem>
          ))}
        </CustomSelect>
        {tabOption === tabOptions[1] && (
          <CustomSelect
            value={relationOption}
            onChange={(e) => setRelationOption(e.target.value)}
          >
            {relationOptions.map((option, index) => (
              <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
          </CustomSelect>
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
