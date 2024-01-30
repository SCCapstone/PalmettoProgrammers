import { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Container, Typography, CssBaseline, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PostService from '../../services/postService';
import UserContext from '../../context/userContext';
import Chat from '../Chat';
import ChatLocked from '../ChatLocked';
import NoPage from './NoPage';

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
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

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
    setLoading(true);
    try {
      const data = await PostService.getPostDetails(postId);
      setIsOwner(user && (data.creator.id === user.id));
      setPost(data);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
    setLoading(false);
  }, [postId, user]);

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

  const renderChat = () => {
    if (post.hasJoined) {
      return <Chat chatId={post.chatId} />;
    } else {
      var reason = user ? 'not-joined' : 'no-user';
      return (
        <ChatLocked
          chatType="post"
          reason={reason}
          onResolutionClick={handleJoinPost}
        />
      );
    }
  };

  const renderLeaveButton = () => {
    if (!post.hasJoined || isOwner) {
      return;
    }

    console.log('is own profile ad asd:', isOwner);
    return (
      <Button variant="contained" color="secondary" onClick={handleLeavePost}>
        Leave
      </Button>
    );
  };

  if (post && !loading) {
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
                by {post?.creator.username}
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
            {renderLeaveButton()}
          </Box>
        </Container>
        {renderChat()}
      </ThemeProvider>
    );
  } else if (!post && !loading) {
    return <NoPage />;
  }
};
export default PostPage;
