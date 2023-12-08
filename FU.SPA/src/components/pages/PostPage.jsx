import { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Container, Typography, CssBaseline, Button } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PostService from '../../services/postService';
import UserContext from '../../context/userContext';

const boxStyle = {
  maxWidth: 600,
  margin: 'auto',
  marginTop: 16,
  marginLeft: 0,
};

const defaultTheme = createTheme();

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const { user } = useContext(UserContext);

  const handleJoinPost = async () => {
    try {
      await PostService.joinPost(post.id);
      update();
    } catch (error) {
      console.error('Error joining post:', error);
    }
  };

  const handleLeavePost = async () => {
    try {
      await PostService.leavePost(post.id);
      update();
    } catch (error) {
      console.error('Error leaving post:', error);
    }
  };

  const update = useCallback(async () => {
    try {
      const data = await PostService.getPostDetails(postId);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  }, [postId]);

  useEffect(() => {
    update();
  }, [postId, update]);

  let dateTimeString = 'Unspecified time';

  if (post && post.startTime) {
    dateTimeString = new Date(post.startTime).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box style={boxStyle}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'baseline',
            }}
          >
            <Typography variant="h4" gutterBottom>
              {post?.title}
            </Typography>
            <Typography variant="h5" color="textSecondary">
              {post?.game}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              by {post?.creator}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {dateTimeString}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              paragraph
              style={{ wordWrap: 'break-word', textAlign: 'left' }}
            >
              {post?.description}
            </Typography>
          </div>
          {!post?.hasJoined && user && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleJoinPost}
            >
              Join
            </Button>
          )}
          {post?.hasJoined && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLeavePost}
            >
              Leave
            </Button>
          )}
          {post?.hasJoined && (
            <Link
              to={`/chat/${post.chatId}`}
              style={{ textDecoration: 'none' }}
            >
              <Button size="large">Chat</Button>
            </Link>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default PostPage;
