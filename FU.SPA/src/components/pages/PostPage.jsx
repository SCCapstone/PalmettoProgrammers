import { useState, useEffect, useContext, useCallback } from 'react';
import { Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import PostService from '../../services/postService';
import UserContext from '../../context/userContext';
import Chat from '../Chat';
import ChatLocked from '../ChatLocked';
import NoPage from './NoPage';
import PostUsersList from '../PostUsersList';
import PostCard from '../PostCard';
import './PostPage.css';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

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
        style={{ width: '250px' }}
        onClick={() => setLeaveDialogOpen(true)}
      >
        Leave
      </Button>
    );
  };

  const renderEditButton = () => {
    if (user == null || user.id !== post.creator.id) return;

    return (
      <Button
        variant="contained"
        style={{ width: '250px' }}
        onClick={() => navigate(`edit`)}
      >
        Edit Post Details
      </Button>
    );
  }

  const ConfirmLeaveDialog = () => {
    const handleClose = () => {
      setLeaveDialogOpen(false);
    };

    return (
      <>
        <Dialog
          open={leaveDialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to leave?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This may be irreversible
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                handleClose();
                handleLeavePost();
              }}
              autoFocus
            >
              Leave
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  if (post && !loading) {
    return (
      <div className="post-page-wrapper">
        <PostCard post={post} showActions={false} />
        {renderLeaveButton()}
        <PostUsersList postId={post.id} />
        {renderChat()}
        {renderEditButton()}
        <ConfirmLeaveDialog />
      </div>
    );
  } else if (!post && !loading) {
    return <NoPage />;
  }
};
export default PostPage;
