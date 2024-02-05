import { useEffect, useState, useContext } from 'react';

import {
  Card,
  CardActions,
  Button,
  CardContent,
  TextField,
  CardHeader,
  Avatar,
} from '@mui/material';

import PostService from '../services/postService';
import './PostUsersList.css';
import { useNavigate } from 'react-router-dom';

export default function PostUsersList({ postId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await PostService.getPostUsers(postId);
        console.log('users:', users);
        setUsers(users);
      } catch (error) {
        console.error('Error fetching post users:', error);
      }
    };

    fetchUsers();
  }, [postId]);

  return (
    <Card
      style={{
        backgroundColor: '#31084A',
        maxWidth: '300px',
      }}
    >
      <CardHeader
        title="Players"
        style={{
          color: 'white',
          textAlign: 'left',
          paddingBottom: '0px',
          paddingTop: '5px',
        }}
      ></CardHeader>
      <CardContent
        style={{
          paddingBottom: '0px',
          paddingTop: '0px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </CardContent>
    </Card>
  );
}

const UserListItem = ({ user }) => {
  const navigate = useNavigate();
  const defaultPfp = user.pfpUrl.includes(
    'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
  );

  const stringToColor = (string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const initials = (name) => {
    // split  name by spaces and filter empty entries
    let nameParts = name.split(' ').filter(Boolean);
    // get the first letter of the first part
    let initials = nameParts[0][0];
    // if there is a second part to name
    if (nameParts.length > 1) {
      initials += nameParts[1][0];
    }

    return initials;
  };

  const renderPfp = () => {
    return defaultPfp ? (
      <Avatar
        sx={{
          bgcolor: stringToColor(user.username),
          width: 30,
          height: 30,
        }}
      >
        {initials(user.username)}
      </Avatar>
    ) : (
      <Avatar
        alt={user.username}
        src={user.pfpUrl}
        sx={{ width: 30, height: 30 }}
      />
    );
  };

  const renderOnlineStatus = (isOnline) => {
    if (!isOnline) return;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
      >
        <path
          d="M10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5Z"
          fill="#4CD436"
        />
      </svg>
    );
  };

  return (
    <div className="user-wrapper">
      {renderPfp()}
      <div className="user-info">
        <div
          className="user-name"
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          {user.username}
        </div>
        {renderOnlineStatus(user.isOnline)}
      </div>
    </div>
  );
};
