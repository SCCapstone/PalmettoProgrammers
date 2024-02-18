import { Card, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * ChatLocked component
 * @param {string} chatType - the type of chat to be locked {post|direct}
 * @param {string} reason - the reason the chat is locked {no-user|not-joined}
 * @param {function} onResolutionClick - a function to be called when the resolution button is clicked
 * @returns JSX
 */
export default function ChatLocked({ chatType, reason, onResolutionClick }) {
  const navigate = useNavigate();

  const renderMessage = () => {
    let reasonMessage;

    if (reason === 'no-user') {
      reasonMessage = `You must be signed in to ${
        chatType === 'post' ? 'view this chat' : 'message this user'
      }`;
    } else {
      reasonMessage = `You must join this post to view the chat`;
    }

    return (
      <Typography variant="h4" gutterBottom style={{ color: 'white' }}>
        {reasonMessage}
      </Typography>
    );
  };

  const renderResolution = () => {
    // get the current path
    var path = window.location.pathname;
    let resolutionMessage = reason === 'no-user' ? 'Sign In' : 'Join';
    return (
      <Button
        style={{ backgroundColor: '#E340DC', color: '#FFF', width: '95%' }}
        onClick={() => {
          if (reason === 'no-user') {
            navigate('/signin?returnUrl=' + encodeURIComponent(path));
          }

          if (onResolutionClick) {
            onResolutionClick();
          }
        }}
      >
        {resolutionMessage}
      </Button>
    );
  };

  return (
    <Card
      style={{
        textAlign: 'left',
        backgroundColor: '#31084A',
        width: '700px',
        height: '90%',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        bottom: '0',
        right: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '40px',
      }}
    >
      {renderMessage()}
      {renderResolution()}
    </Card>
  );
}
