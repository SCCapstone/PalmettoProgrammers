import {
  Card,
  CardActions,
  Button,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  let dateTimeString = 'Unspecified time';

  if (post.startTime) {
    dateTimeString = new Date(post.startTime).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  return (
    <Card style={{ textAlign: 'left' }}>
      <CardContent style={{ width: '200pt', height: '250pt' }}>
        <Typography variant="body2" color="text.secondary">
          by {post.creator}
        </Typography>
        <Typography variant="h5">{post.title}</Typography>
        {post.startTime && (
          <Typography variant="body1">{dateTimeString}</Typography>
        )}
        <br />
        <Typography variant="body2" color="text.primary">
          {post.description}
        </Typography>
        <br />
        <div>
          {post.tags.map((t) => (
            <Chip key={t} label={t} variant="outlined" />
          ))}
        </div>
      </CardContent>
      <CardActions>
        <Button size="large">View</Button>
        {post.hasJoined && (
          <Link to={`/chat/${post.chatId}`} style={{ textDecoration: 'none' }}>
            <Button size="large">Chat</Button>
          </Link>
        )}
      </CardActions>
    </Card>
  );
};

export default PostCard;
