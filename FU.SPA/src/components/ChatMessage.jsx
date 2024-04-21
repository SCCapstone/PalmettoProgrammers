import './ChatMessage.css';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DateUtils from '../helpers/dateUtils';

/**
 * This component is used to render a chat message
 *
 * @param {object} chatMessage The chat message object
 * @param {boolean} userIsSender A boolean to check if the current user is the sender
 *
 * @returns The rendered chat message component
 */
export default function ChatMessage({ chatMessage, userIsSender }) {
  const user = chatMessage.sender;
  const navigate = useNavigate();
  const defaultPfp =
    !user.pfpUrl ||
    (user.pfpUrl !== null &&
      user.pfpUrl.includes(
        'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
      ));

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
          width: 40,
          height: 40,
        }}
      >
        {initials(user.username)}
      </Avatar>
    ) : (
      <Avatar alt={user.username} src={user.pfpUrl} />
    );
  };

  return (
    <div
      className={`chat-message-container ${userIsSender ? 'is-sender' : ''}`}
    >
      <div className="chat-message-user">{renderPfp()}</div>
      <div className="chat-message">
        <div className="chat-message-info">
          <div
            className="chat-message-sender"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            {user.username}
          </div>
          <div className="chat-message-time">
            {DateUtils.timeDifference(chatMessage.createdAt)}
          </div>
        </div>
        <div className="chat-message-content">{chatMessage.content}</div>
      </div>
    </div>
  );
}
