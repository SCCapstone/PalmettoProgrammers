import {
  Card,
  CardActions,
  Button,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './PostCard.css';
import Theme from '../Theme';
import dayjs from 'dayjs';
import { Done } from '@mui/icons-material';
import ChatMessage from './ChatMessage';

const PostCard = ({ post, showActions, onTagClick, showJoinedStatus }) => {
  const navigate = useNavigate();
  const user = post.creator;
  let dateTimeString = 'No time';
  if (showActions === undefined) {
    showActions = true;
  }

  const handleTagClick = (tag) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const renderJoinedStatus = () => {
    if (!showJoinedStatus || !post.hasJoined) {
      return null;
    }

    return (
      <Tooltip title="You have joined this post">
        <Done />
      </Tooltip>
    );
  };

  // If we have a start time, then we also have an end time
  if (post.startTime) {
    let startOfToday = dayjs().startOf('day');
    let postStartDateTime = dayjs(post.startTime);

    let startDate = dayjs(post.startTime).format('MMM D, YYYY');
    if (postStartDateTime < startOfToday) {
      // Use default
    } else if (postStartDateTime < startOfToday.add(1, 'day')) {
      startDate = 'Today';
    } else if (postStartDateTime < startOfToday.add(2, 'day')) {
      startDate = 'Tomorrow';
    } else if (postStartDateTime < startOfToday.add(6, 'day')) {
      startDate = dayjs(post.startTime).format('ddd');
    } else if (postStartDateTime < startOfToday.add(1, 'year')) {
      startDate = dayjs(post.startTime).format('MMM D');
    }

    var startTime = new Date(post.startTime).toLocaleString('en-US', {
      timeStyle: 'short',
    });
    var endTime = new Date(post.endTime).toLocaleString('en-US', {
      timeStyle: 'short',
    });

    dateTimeString = `${startDate}, ${startTime} - ${endTime}`;
  } else {
    dateTimeString = 'No time';
  }

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

  return (
    <Card sx={{ width: 250 }}>
      <CardContent sx={{ textAlign: 'left', height: 300 }}>
        <div
          className="user-header"
          onClick={() => navigate(`/profile/${user.id}`)}
          style={{
            color: Theme.palette.primary.main,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            className="user-info"
            style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
          >
            <Avatar
              alt={user?.username}
              src={user?.pfpUrl}
              sx={{
                width: 18,
                height: 18,
                bgcolor: stringToColor(user?.username),
              }}
            />
            <Typography variant="subtitle2">{`by ${user.username}`}</Typography>
          </div>
          {renderJoinedStatus()}
        </div>
        <Tooltip title={post.title}>
          <Typography variant="h6" noWrap sx={{ whiteSpace: 'nowrap' }}>
            {post.title}
          </Typography>
        </Tooltip>
        <Tooltip title={post.game}>
          <Typography variant="subtitle1" noWrap sx={{ whiteSpace: 'nowrap' }}>
            {post.game}
          </Typography>
        </Tooltip>
        <Typography variant="body2" noWrap>
          {dateTimeString}
        </Typography>
        <Divider
          sx={{
            borderColor: Theme.palette.primary.main,
            borderWidth: 1,
            margin: '5px 0',
          }}
        />
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: 80,
          }}
        >
          {post.description}
        </Typography>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            paddingTop: '10px',
            gap: '5px',
            maxHeight: 80,
            overflow: 'hidden',
          }}
        >
          {post.tags.map((t) => (
            <Chip
              key={t}
              label={'# ' + t}
              onClick={showActions ? () => handleTagClick(t) : null}
            />
          ))}
        </div>
        {post.lastMessage && (
          <ChatMessage chatMessage={post.lastMessage} userIsSender={false} />
        )}
      </CardContent>
      {showActions && (
        <CardActions>
          <Button
            variant="contained"
            style={{ width: '100%' }}
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            View
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PostCard;
