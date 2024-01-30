import { useEffect, useState, useContext } from 'react';
import {
  Card,
  CardActions,
  Button,
  CardContent,
  TextField,
} from '@mui/material';
import UserContext from '../context/userContext';

/**
 * ChatLocked component
 * @param {string} chatType - the type of chat to be locked {post|direct}
 * @param {string} reason - the reason the chat is locked {no-user|not-joined}
 * @returns JSX
 */
export default function ChatLocked({ chatType, reason }) {
  const { user } = useContext(UserContext);

  return (
    <Card
      style={{
        textAlign: 'left',
        backgroundColor: '#31084A',
        width: '700px',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        bottom: '0',
        right: '5%',
      }}
    >
        {reason}
        {chatType}
    </Card>
  );
}
