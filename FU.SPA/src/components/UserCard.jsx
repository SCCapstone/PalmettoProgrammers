import {
  Stack,
  Divider,
  Card,
  CardActions,
  Button,
  CardContent,
  Typography,
  Avatar,
  Tooltip,
} from '@mui/material';
import Theme from '../Theme';
import { useNavigate } from 'react-router-dom';
import { People, PendingActions, CallMade } from '@mui/icons-material';
import ChatMessagePreview from './ChatMessagePreview';

const UserCard = ({ user, showRelationStatus, showActions }) => {
  if (showRelationStatus === undefined) {
    showRelationStatus = false;
  }

  const navigate = useNavigate();

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

  return (
    <Card
      style={{
        textAlign: 'left',
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent style={{ textAlign: 'left', height: 300 }}>
        <Stack
          sx={{ '&:hover': showActions ? { cursor: 'pointer' } : {} }}
          alignItems="center"
          direction="row"
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <Avatar
            alt={user?.username}
            src={user?.pfpUrl}
            sx={{
              width: 40,
              height: 40,
              bgcolor: stringToColor(user?.username),
            }}
          />
          <Tooltip title={user.username}>
            <Typography
              variant="h5"
              sx={{
                '&:hover': showActions
                  ? {
                      textDecoration: 'underline',
                      textDecorationThickness: '2px',
                    }
                  : {},
                color: '#FFF',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                ml: 1,
              }}
            >
              {user.username}
            </Typography>
          </Tooltip>
          <div style={{ flexGrow: 9 }} />
          {renderRelationStatus()}
        </Stack>
        {user.dob && (
          <Typography variant="subtitle1" sx={{ mb: '-6px' }}>
            {age} years old
          </Typography>
        )}
        <Divider
          sx={{
            borderColor: Theme.palette.primary.main,
            borderWidth: 1,
            marginTop: '8px',
            marginBottom: '6px',
          }}
        />
        <Tooltip title={user.bio}>
          <Typography
            variant="body2"
            sx={{
              height: 80,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              overflowWrap: 'break-word',
            }}
          >
            {user.bio}
          </Typography>
        </Tooltip>
        {user.lastMessage && (
          <ChatMessagePreview chatMessage={user.lastMessage} />
        )}
      </CardContent>
      {showActions && (
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            style={{ color: '#FFF', width: '100%' }}
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            View Profile
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default UserCard;
