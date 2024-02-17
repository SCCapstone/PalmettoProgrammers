import { useState, useEffect, useContext, useCallback } from 'react';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import PostService from '../../services/postService';
import UserContext from '../../context/userContext';
import Chat from '../Chat';
import ChatLocked from '../ChatLocked';
import NoPage from './NoPage';
import PostUsersList from '../PostUsersList';
import PostCard from '../PostCard';
import './PostPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
      navigate(-1);
    } catch (error) {
      console.error('Error leaving post:', error);
    }
  };

  const update = useCallback(async () => {
    setLoading(true);
    try {
      const data = await PostService.getPostDetails(postId);
      console.log('data:', data);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    update();
  }, [postId, update]);

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
    if (!post.hasJoined) return;

    return (
      <Button
        variant="contained"
        style={{ backgroundColor: '#E340DC', width: '250px' }}
        onClick={handleLeavePost}
      >
        Leave
      </Button>
    );
  };

  if (post && !loading) {
    return (
      <div className="post-page-wrapper">
        <PostCard post={post} showActions={false} />
        {renderLeaveButton()}
        <PostUsersList postId={post.id} />
        {renderChat()}
      </div>
    );
  } else if (!post && !loading) {
    return <NoPage />;
  }
};
export default PostPage;
