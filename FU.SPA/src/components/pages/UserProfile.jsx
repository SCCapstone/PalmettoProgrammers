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
import UserCard from '../UserCard';
import ProfileSettings from './ProfileSettings';

// Component for UserProfile
const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const update = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await UserService.getUserprofile(userId);
      setUserProfile(profile);
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

  // Renders a chat if on another user's profile
  const renderChat = () => {
    if (isOwnProfile) {
      return null;
    } else if (user && chatId) {
      return <Chat chatId={chatId} />;
    } else {
      return <ChatLocked chatType="direct" reason="no-user" />;
    }
  };

  if (loading) {
    return null;
  } else if (userProfile) {
    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <UserCard user={userProfile} showRelationStatus={true} />
          {!isOwnProfile && (
            <SocialRelationActionButton requesteeId={userProfile?.id} />
          )}
          {isOwnProfile && <AccountSettingButton />}
        </div>
        {isOwnProfile && <ProfileSettings />}
        {renderChat()}
      </div>
    );
  } else {
    return <NoPage />;
  }
};

// param requesteeId: the id of the user profile to act on
const SocialRelationActionButton = ({ requesteeId }) => {
  const { user: currentUser } = useContext(UserContext);
  const [relationStatus, setRelationStatus] = useState();

  const UpdateStatus = () => {
    if (requesteeId && currentUser && currentUser.id !== requesteeId)
      RelationService.getStatus(requesteeId).then((s) => setRelationStatus(s));
  };

  // Only call on first load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => UpdateStatus(), []);

  let handleClick = () => {};
  let buttonText = '';
  let declineButtonText = 'Decline Friend Request';
  const declineRequest = async () => {
    await RelationService.removeRelation(requesteeId);
    UpdateStatus();
  };

  // don't render if current user and viewed user are not loaded
  if (!requesteeId || !currentUser) return;

  // don't render if viewing your own profile
  if (requesteeId === currentUser.id) return;

  // Handles button displayed for different relations
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
    <>
      <Button
        onClick={handleClick}
        variant="contained"
        style={{ width: 'auto' }}
      >
        {buttonText}
      </Button>
      {relationStatus === RelationService.STATUS.PENDING && (
        <Button
          onClick={declineRequest}
          variant="outlined"
          style={{ width: 'auto' }}
        >
          {declineButtonText}
        </Button>
      )}
    </>
  );
};

const AccountSettingButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant="contained" onClick={() => navigate(`/accountsettings`)}>
        Account Settings
      </Button>
    </>
  );
};

export default UserProfile;
