import {
  Card,
  CardActions,
  Button,
  CardContent,
  Typography,
  Chip,
  CardHeader,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './PostCard.css';
import Theme from '../Theme';

const PostCard = ({ post, showActions }) => {
  const navigate = useNavigate();
  const user = post.creator;
  const defaultPfp =
    !user.pfpUrl ||
    (user.pfpUrl !== null &&
      user.pfpUrl.includes(
        'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
      ));
  let dateTimeString = 'Unspecified time';
  if (showActions === undefined) {
    showActions = true;
  }

  // If we have a start time, then we also have an end time
  if (post.startTime) {
    var startTime = new Date(post.startTime).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    var endTime = new Date(post.endTime).toLocaleString('en-US', {
      timeStyle: 'short',
    });
    dateTimeString = `${startTime} - ${endTime}`;
  } else {
    dateTimeString = 'Unspecified time';
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {renderPfp()}
              <Typography
                variant="h6"
                style={{
                  fontSize: 'medium',
                  display: 'flex',
                  gap: '5px',
                }}
              >
                by
                <div
                  className="user-name"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  {user.username}
                </div>
              </Typography>
            </div>
            <Typography variant="h5" style={{ color: '#FFF' }}>
              {post.title}
            </Typography>
            <Typography variant="h6" style={{ color: '#FFF' }}>
              {post.game}
            </Typography>
            <Typography variant="body1" style={{ color: '#FFF' }}>
              {dateTimeString}
            </Typography>
            <div
              style={{
                borderTop: `2px solid ${Theme.palette.primary.main}`,
                marginTop: '5px',
              }}
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
        <Typography variant="body2">{post.description}</Typography>
        <div style={{ paddingTop: '10px' }}>
          {post.tags.map((t) => (
            <Chip key={t} label={'# ' + t} />
          ))}
        </div>
      </CardContent>
      {showActions && (
        <CardActions style={{ justifyContent: 'flex-end' }}>
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
