import { Typography } from '@mui/material';
import DateUtils from '../helpers/dateUtils';

export default function ChatMessage({ chatMessage }) {
  return (
    <div style={{ fontStyle: 'italic' }}>
      <Typography
        variant="body1"
        style={{
          fontSize: '12px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          paddingTop: '10px',
        }}
      >
        {chatMessage.sender.username}: {chatMessage.content}
      </Typography>
      <Typography
        variant="body2"
        style={{ fontSize: '10px', color: '#e340dc' }}
      >
        {DateUtils.timeDifference(chatMessage.createdAt)}
      </Typography>
    </div>
  );
}