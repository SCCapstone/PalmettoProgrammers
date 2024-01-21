import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserContext from '../../context/userContext';
import UserService from '../../services/userService';
import NoPage from './NoPage';
import './UserProfile.css';
import { getDirectChat } from '../../services/chatService';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [defaultPFP, setDefaultPFP] = useState(false);

  const update = useCallback(async () => {
    try {
      const profile = await UserService.getUserprofile(username);
      setUserProfile(profile);
      setDefaultPFP(
        profile.pfpUrl.includes(
          'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
        ),
      );
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [username]);

  useEffect(() => {
    update();
  }, [username, update]);

  // convert dob to years old
  const dob = new Date(userProfile?.dob);
  const today = new Date();
  const age = Math.floor(
    (today.getTime() - dob.getTime()) / (1000 * 3600 * 24 * 365),
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
    return !defaultPFP ? (
      <img src={userProfile.pfpUrl} className="userImage" />
    ) : (
      <div
        className="userImage"
        style={{
          backgroundColor: stringToColor(userProfile.username),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '40px',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {initials(userProfile.username)}
      </div>
    );
  };

  const renderBio = () => {
    if (!userProfile.bio) {
      return;
    }

    return (
      <div className="bio">
        <h1>About Me</h1>
        <p>{userProfile.bio}</p>
      </div>
    );
  };

  const renderHeaderButtons = () => {
    if (!user || user.username === userProfile.username) {
      return;
    }

    return (
      <div className="buttons">
        <button className="messageButton" onClick={clickSendMessage}>
          Send Message
        </button>
        <button className="friendButton">Send Friend Request</button>
      </div>
    );
  };

  const clickSendMessage = async () => {
    const chat = await getDirectChat(userProfile.id);
    navigate(`/chat/${chat.id}`);
  };

  if (userProfile) {
    return (
      <>
        <div className="header">
          <div className="left-content">
            {renderPfp()}
            <div className="userInfo">
              <p className="userName">{userProfile.username}</p>
              {userProfile.dob && <p>Age: {age} years old</p>}
            </div>
          </div>
          <div className="right-content">{renderHeaderButtons()}</div>
        </div>
        <div className="body">{renderBio()}</div>
      </>
    );
  } else {
    return <NoPage />;
  }
}
