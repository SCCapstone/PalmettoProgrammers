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
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Store } from 'react-notifications-component';

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
      // Error notification
      Store.addNotification({
        title: 'Error joining post',
        message: 'An error has occured. Please try again.',
        type: 'danger',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
      console.error('Error joining post:', error);
    }
  };

  const handleLeavePost = async () => {
    try {
      await PostService.leavePost(post.id);
      navigate(-1);
    } catch (error) {
      // Error notification
      Store.addNotification({
        title: 'Error leaving post',
        message: 'An error has occured. Please try again.',
        type: 'danger',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
      console.error('Error leaving post:', error);
    }
  };

  const update = useCallback(async () => {
    setLoading(true);
    try {
      const data = await PostService.getPostDetails(postId);
      setPost(data);
    } catch (error) {
      // Error notification
      Store.addNotification({
        title: 'Error getting details',
        message: 'An error has occured.\n' + error,
        type: 'danger',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
      console.error('Error fetching post details:', error);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    update();
  }, [postId, update]);

  const renderChat = () => {
    if (user && post.hasJoined) {
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
  };

  const ConfirmLeaveDialog = () => {
    const handleClose = () => {
      setLeaveDialogOpen(false);
    };

    // Displays leave confirmation Dialog for a post
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
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <PostCard post={post} showActions={false} />
          {renderLeaveButton()}
          <PostUsersList postId={post.id} />
          {renderEditButton()}
          <ConfirmLeaveDialog />
        </div>
        {renderChat()}
      </div>
    );
  } else if (!post && !loading) {
    return <NoPage />;
  }
};
export default PostPage;
