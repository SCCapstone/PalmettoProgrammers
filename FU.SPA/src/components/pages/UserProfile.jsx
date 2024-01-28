import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../context/userContext';
import UserService from '../../services/userService';
import NoPage from './NoPage';
import './UserProfile.css';
import { getDirectChat } from '../../services/chatService';
import Chat from '../Chat';

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [defaultPFP, setDefaultPFP] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  const update = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await UserService.getUserprofile(userId);
      setUserProfile(profile);
      setDefaultPFP(
        profile.pfpUrl.includes(
          'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
        ),
      );
      if (user) {
        const chat = await getDirectChat(profile.id);
        setChatId(chat.id);
        setIsOwnProfile(user.id === profile.id);
      } else {
        setIsOwnProfile(false);
      }
      const chatCollapsedKey = `chat-${chatId}-collapsed`;
      setIsChatCollapsed(
        localStorage.getItem(chatCollapsedKey) === 'true' ||
          user === null ||
          isOwnProfile,
      );
      console.log('is chat collapsed:', isChatCollapsed);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  }, [userId, user]);

  useEffect(() => {
    update();
  }, [userId, update]);

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
        <button className="friendButton">Send Friend Request</button>
      </div>
    );
  };

  const renderOnlineStatus = (isOnline) => {
    const fillColor = isOnline ? '#4CD436' : '#FF0000';

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
          fill={fillColor}
        />
      </svg>
    );
  };

  const handleChatCollapse = () => {
    setIsChatCollapsed(!isChatCollapsed);
  };

  const renderChat = () => {
    if ((isOwnProfile || !chatId) && !loading) {
      return;
    }
    return <Chat chatId={chatId} onChatCollapse={handleChatCollapse} />;
  };

  if (userProfile && !loading) {
    return (
      <div className="page-wrapper">
        <div
          className="header"
          style={{
            width: isChatCollapsed ? '100%' : '60%',
            transition: 'width 0.3s ease',
          }}
        >
          <div className="left-content">
            {renderPfp()}
            <div className="userInfo">
              <p className="userName">{userProfile.username}</p>
              <p>Online Status: {renderOnlineStatus(userProfile.isOnline)}</p>
              {userProfile.dob && <p>Age: {age} years old</p>}
            </div>
          </div>
          <div className="right-content">{renderHeaderButtons()}</div>
        </div>
        <div className="body">{renderBio()}</div>
        {renderChat()}
      </div>
    );
  } else if (!userProfile && !loading) {
    return <NoPage />;
  }
};

export default UserProfile;
