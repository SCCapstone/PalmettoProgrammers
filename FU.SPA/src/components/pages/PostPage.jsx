import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CssBaseline } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PostService from '../../services/PostService';
const boxStyle = {
  maxWidth: 600,
  margin: 'auto',
  marginTop: 16,
  marginLeft: 0,
};

const defaultTheme = createTheme();
const PostPage = () => {
  const dateTimeString = new Date(post.startTime).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const data = await PostService.getPostDetails(postId);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postId]);
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
              {post.title}
            </Typography>
            <Typography variant="h5" color="textSecondary">
              {post.game}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              by {post.creator}
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
              {post.description}
            </Typography>
          </div>
          {post.hasJoined && (
          <Link to={`/chat/${post.chatId}`} style={{ textDecoration: 'none' }}>
            <Button size="large">Chat</Button>
          </Link>
        )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default PostPage;
