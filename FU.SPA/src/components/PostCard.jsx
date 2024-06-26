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
import ChatMessagePreview from './ChatMessagePreview';

// Function that displays a card with details of a given post
const PostCard = ({ post, showActions, onTagClick, showJoinedStatus }) => {
  const navigate = useNavigate();
  const user = post.creator;
  let dateTimeString = 'No time';
  if (showActions === undefined) {
    showActions = true;
  }

  //
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
    let postEndDateTime = dayjs(post.endTime);

    let startDate = dayjs(post.startTime).format('MMM D, YYYY');
    // This block handles formatting of start date display on card
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

    let endDate = '';
    if (!postEndDateTime.isSame(postStartDateTime, 'day')) {
      endDate = dayjs(post.endTime).format('MMM D, YYYY');
      // This block handles formatting of end date display on card
      if (postEndDateTime < startOfToday) {
        // Use default
      } else if (postEndDateTime < startOfToday.add(1, 'day')) {
        endDate = 'Today';
      } else if (postEndDateTime < startOfToday.add(2, 'day')) {
        endDate = 'Tomorrow';
      } else if (postEndDateTime < startOfToday.add(6, 'day')) {
        endDate = dayjs(post.endTime).format('ddd');
      } else if (postEndDateTime < startOfToday.add(1, 'year')) {
        endDate = dayjs(post.endTime).format('MMM D');
      }
    }

    var startTime = new Date(post.startTime).toLocaleString('en-US', {
      timeStyle: 'short',
    });
    var endTime = new Date(post.endTime).toLocaleString('en-US', {
      timeStyle: 'short',
    });

    dateTimeString = `${startDate}, ${startTime} - `;
    if (endDate !== '') {
      dateTimeString += `${endDate}, `;
    }
    dateTimeString += `${endTime}`;
  } else {
    dateTimeString = 'No time';
  }

  const stringToColor = (string) => {
    if (!string) return null;

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

  // Returns card with post details to be displayed
  return (
    <Card sx={{ width: 250 }}>
      <CardContent sx={{ textAlign: 'left', height: 350 }}>
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
            <Typography variant="subtitle2">{`by ${user?.username}`}</Typography>
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
        <Tooltip title={dateTimeString}>
          <Typography variant="body2" noWrap>
            {dateTimeString}
          </Typography>
        </Tooltip>
        <Divider
          sx={{
            borderColor: Theme.palette.primary.main,
            borderWidth: 1,
            margin: '5px 0',
          }}
        />
        <Tooltip title={post.description}>
          <Typography
            variant="body2"
            sx={{
              maxHeight: 80,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              overflowWrap: 'break-word',
            }}
          >
            {post.description}
          </Typography>
        </Tooltip>
        {post.lastMessage && (
          <ChatMessagePreview chatMessage={post.lastMessage} />
        )}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            paddingTop: 10,
            gap: '5px',
            maxHeight: 80,
            overflow: 'hidden',
          }}
        >
          {post.tags.map((t) => (
            <Chip
              key={t}
              label={'# ' + t}
              onClick={onTagClick ? () => handleTagClick(t) : null}
            />
          ))}
        </div>
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
