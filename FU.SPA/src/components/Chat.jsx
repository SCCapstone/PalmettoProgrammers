import { useEffect, useState, useContext } from 'react';
import {
  TextField,
  Card,
  CardActions,
  Button,
  CardContent,
} from '@mui/material';
import {
  joinChatGroup,
  leaveChatGroup,
  hubConnection,
} from '../services/signalrService';
import { getMessages, saveMessage } from '../services/chatService';
import './Chat.css';
import ChatMessage from './ChatMessage';
import UserContext from '../context/userContext';
import config from '../config';

/**
 * The Chat component is used to render the chat interface
 * 
 * @param {number} chatId The id of the chat 
 * @returns The rendered chat component
 */
export default function Chat({ chatId }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [offset, setOffset] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const { user } = useContext(UserContext);
  const [isNewMessageReceived, setIsNewMessageReceived] = useState(false);
  const limit = 25;


  // Set the chat messages and join the chat group
  useEffect(() => {
    const initializeChat = async () => {
      try {
        var messages = await getMessages(chatId, 1, limit);
        if (!messages) {
          messages = [];
        }
        setMessages(messages);
        // See #281: We need to wait for the signalR connection to be started before joining the chat
        await new Promise((resolve) => setTimeout(resolve, config.WAIT_TIME));
        await joinChatGroup(chatId);
      } catch (error) {
        console.error(error);
        setMessages(null);
      }
    };

    // Handles receiving messages
    const handleReceiveMessage = (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);

      // Return if user is the sender
      if (receivedMessage.sender.username === user.username) {
        return;
      }

      setIsNewMessageReceived(true);
      setTimeout(() => {
        setIsNewMessageReceived(false);
      }, 1000);
    };

    initializeChat();

    hubConnection.on('ReceiveMessage', handleReceiveMessage);

    return () => {
      hubConnection.off('ReceiveMessage', handleReceiveMessage);
      leaveChatGroup(chatId);
    };
  }, [chatId, user]);

  // Load more messages when user is scrolled near the top
  useEffect(() => {
    const loadMoreMessages = async () => {
      try {
        const newMessages = await getMessages(chatId, offset, limit);

        // Check if there are more messages
        if (newMessages.length > 0) {
          setMessages((prevMessages) => [...newMessages, ...prevMessages]);
        } else {
          setHasMoreMessages(false);
        }
      } catch (error) {
        console.error(error);
        setHasMoreMessages(false);
        setMessages(null);
      }
    };
    // Load more messages when offset changes
    if (offset > 1) {
      loadMoreMessages();
    }
  }, [offset, chatId]);

  // Save the message to the database
  async function handleSendMessage() {
    try {
      if (message === '') {
        return;
      }
      await saveMessage(message, chatId);
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  }

  // Handle scrolling to load more messages
  const handleScroll = (event) => {
    if (event.target.scrollTop === 0) {
      if (hasMoreMessages) {
        setOffset((prevOffset) => prevOffset + 1);
      }
    }
  };

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    // Scroll to the bottom when messages are updated
    const chatContainer = document
      .querySelector('.chat-card')
      .querySelector('.MuiCardContent-root');
    const scrollDifference = chatContainer.scrollHeight - prevScrollHeight;

    if (scrollDifference > 0) {
      chatContainer.scrollTop += scrollDifference;
      setPrevScrollHeight(chatContainer.scrollHeight);
    }
  }, [messages, prevScrollHeight]);

  return (
    <Card
      className="chat-card"
      style={{
        textAlign: 'left',
        minWidth: '300px',
        width: '100%',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        right: '5%',
        animation: isNewMessageReceived
          ? 'sparkle 1s ease-in-out infinite'
          : 'none',
      }}
    >
      <CardContent
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflowY: 'auto',
        }}
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            chatMessage={msg}
            userIsSender={user?.username === msg.sender?.username}
          />
        ))}
      </CardContent>
      <CardActions className="chat-actions">
        <TextField
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button
          variant="outlined"
          onClick={handleSendMessage}
          className="send-button"
        >
          Send
        </Button>
      </CardActions>
      <style>{`
        @keyframes sparkle {
          0%,
          100% {
            background-color: #8b008b; /* Original background color (purple) */
            box-shadow: none;
          }
          50% {
            background-color: #ff69b4; /* Sparkle color (pink) */
            box-shadow: 0 0 10px 5px #ff69b4; /* Sparkle shadow (pink) */
          }
        }
      `}</style>
    </Card>
  );
}
