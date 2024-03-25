import {
  Card,
  CardActions,
  Button,
  CardContent,
  Typography,
  CardHeader,
  Avatar,
  Tooltip,
} from '@mui/material';
import './UserCard.css';
import { useNavigate } from 'react-router-dom';
import { People, PendingActions, CallMade } from '@mui/icons-material';
import ChatMessage from './ChatMessage';

const UserCard = ({ user, showRelationStatus }) => {
  if (showRelationStatus === undefined) {
    showRelationStatus = false;
  }

  const navigate = useNavigate();
  const defaultPfp =
    !user.pfpUrl ||
    (user.pfpUrl !== null &&
      user.pfpUrl.includes(
        'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
      ));

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

  // convert dob to years old
  const dob = new Date(user?.dob);
  const today = new Date();
  const age = Math.floor(
    (today.getTime() - dob.getTime()) / (1000 * 3600 * 24 * 365),
  );

  const renderRelationStatus = () => {
    if (!showRelationStatus) {
      return null;
    }

    if (user.relationStatus === 'Friends') {
      return (
        <Tooltip title="Friends">
          <People />
        </Tooltip>
      );
    } else if (user.relationStatus === 'Pending') {
      return (
        <Tooltip title="Pending friend request">
          <PendingActions />
        </Tooltip>
      );
    } else if (user.relationStatus === 'Requested') {
      return (
        <Tooltip title="Friend request sent">
          <CallMade />
        </Tooltip>
      );
    } else {
      return null;
    }
  };

  const renderPfp = () => {
    return defaultPfp ? (
      <Avatar
        sx={{
          bgcolor: stringToColor(user.username),
          width: 40,
          height: 40,
        }}
      >
        {initials(user.username)}
      </Avatar>
    ) : (
      <Avatar
        alt={user.username}
        src={user.pfpUrl}
        sx={{ width: 40, height: 40 }}
      />
    );
  };

  return (
    <Card
      style={{
        textAlign: 'left',
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                {renderPfp()}
                <div
                  className="user-name"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <Typography variant="h5" style={{ color: '#FFF' }}>
                    {user.username}
                  </Typography>
                </div>
              </div>
              {renderRelationStatus()}
            </div>
            {user.dob && (
              <Typography variant="h6" style={{ color: '#FFF' }}>
                {age} years old
              </Typography>
            )}
            <div
              style={{ borderTop: '2px solid #E340DC', marginTop: '5px' }}
            ></div>
          </>
        }
      />
      <CardContent
        style={{
          width: 'auto',
          paddingTop: '0px',
          flex: 1,
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
        }}
      >
        {user.bio && <Typography variant="body2">{user.bio}</Typography>}
        {user.lastMessage && (
          <ChatMessage chatMessage={user.lastMessage} userIsSender={false} />
        )}
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          style={{ color: '#FFF', width: '100%' }}
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserCard;
