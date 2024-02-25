import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../../context/userContext';
import UserService from '../../services/userService';
import NoPage from './NoPage';
import './UserProfile.css';
import { getDirectChat } from '../../services/chatService';
import Chat from '../Chat';
import ChatLocked from '../ChatLocked';
import RelationService from '../../services/relationService';
import Button from '@mui/material/Button';
import { Box, ButtonGroup } from '@mui/material';



const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [defaultPFP, setDefaultPFP] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  

  
  const update = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await UserService.getUserprofile(userId);
      setUserProfile(profile);
      setDefaultPFP(
        !profile.pfpUrl ||
          (profile.pfpUrl !== null &&
            profile.pfpUrl.includes(
              'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
            )),
      );
      setIsOwnProfile(user && user.id === profile.id);
      if (profile && user && !(user.id === profile.id)) {
        const chat = await getDirectChat(profile.id);
        setChatId(chat.id);
      }
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

  const renderChat = () => {
    if (isOwnProfile) {
      return <UserSettings />;
    }
    if (user) {
      return <Chat chatId={chatId} />;
    } else {
      return <ChatLocked chatType="direct" reason="no-user" />;
    }
  };

  if (userProfile && !loading) {
    return (
      <div className="page-wrapper">
        <div
          className="header"
          style={{
            width: isOwnProfile ? '100%' : '55%',
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
          <div className="right-content">
            <SocialRelationActionButton requesteeId={userProfile?.id} />
          </div>
        </div>
        <div className="body">{renderBio()}</div>
        {renderChat()}
      </div>
    );
  } else if (!userProfile && !loading) {
    return <NoPage />;
  }
};

// param requesteeId: the id of the user profile to act on
const SocialRelationActionButton = ({ requesteeId }) => {
  const { user: currentUser } = useContext(UserContext);
  const [relationStatus, setRelationStatus] = useState();

  const UpdateStatus = () => {
    if (requesteeId)
      RelationService.getStatus(requesteeId).then((s) => setRelationStatus(s));
  };

  // Only call on first load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => UpdateStatus(), []);

  let handleClick = () => {};
  let buttonText = '';

  // don't render if current user and viewed user are not loaded
  if (!requesteeId || !currentUser) return;

  // don't render if viewing your own profile
  if (requesteeId === currentUser.id) return;

  if (relationStatus === RelationService.STATUS.NONE) {
    buttonText = 'Send Friend Request';
    handleClick = async () => {
      await RelationService.postRelation(
        requesteeId,
        RelationService.ACTIONS.FRIEND,
      );
      UpdateStatus();
    };
  } else if (relationStatus === RelationService.STATUS.REQUESTED) {
    buttonText = 'Cancel Friend Request';
    handleClick = async () => {
      await RelationService.removeRelation(requesteeId);
      UpdateStatus();
    };
  } else if (relationStatus === RelationService.STATUS.PENDING) {
    buttonText = 'Accept Friend Request';
    handleClick = async () => {
      await RelationService.postRelation(
        requesteeId,
        RelationService.ACTIONS.FRIEND,
      );
      UpdateStatus();
    };
  } else if (relationStatus === RelationService.STATUS.FRIENDS) {
    buttonText = 'Unfriend';
    handleClick = async () => {
      await RelationService.removeRelation(requesteeId);
      UpdateStatus();
    };
  }

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      className="socialRelationActionButton"
    >
      {buttonText}
    </Button>
  );
};

const UserSettings = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        mt: 3,
      }}
    >
      <ButtonGroup variant="contained" aria-label="Basic button group">
      <Button
        onClick={() => navigate(`/accountsettings`)}
      >Account Settings</Button>
      <Button
        onClick={() => navigate(`/profilesettings`)}
      >Profile Settings</Button>
      </ButtonGroup>
    </Box>
  );
};

export default UserProfile;
