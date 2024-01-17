import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserContext from '../../context/userContext';
import UserService from '../../services/userService';
import NoPage from './NoPage';
import './UserProfile.css';

export default function UserProfile() {
  const { username } = useParams();
  const { user } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);

  if (user) {
    return (
      <>
        <div className="header">
          <img
            src="https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png"
            className="userImage"
          />
          <div className="userInfo">
            <p className="userName">{username}</p>
            <p>Online Status</p>
            <p>Age: 17</p>
          </div>
        </div>
        <div className="body"></div>
      </>
    );
  } else {
    return <NoPage />;
  }
}
