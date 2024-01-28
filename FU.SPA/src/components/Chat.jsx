import { useEffect, useState, useContext } from 'react';
import {
  Card,
  CardActions,
  Button,
  CardContent,
  TextField,
} from '@mui/material';
import {
  joinChatGroup,
  leaveChatGroup,
  hubConnection,
} from '../services/signalrService';
import { getChat, getMessages, saveMessage } from '../services/chatService';
import './Chat.css';
import ChatMessage from './ChatMessage';
import UserContext from '../context/userContext';

export default function Chat({ chatId, onChatCollapse }) {
  const chatCollapsedKey = `chat-${chatId}-collapsed`;
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [offset, setOffset] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const { user } = useContext(UserContext);
  // Get is the chat collapsed from local storage
  const [isChatCollapsed, setIsChatCollapsed] = useState(
    localStorage.getItem(chatCollapsedKey) === 'true',
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isNewMessageReceived, setIsNewMessageReceived] = useState(false);
  const limit = 25;

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const chat = await getChat(chatId);
        setChat(chat);
        // sleep to allow the signalr connection to be established
        await new Promise((resolve) => setTimeout(resolve, 40));
        await joinChatGroup(chatId);
        const messages = await getMessages(chatId, 1, limit);
        setMessages(messages);
      } catch (error) {
        console.error(error);
      }
    };

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

  useEffect(() => {
    const loadMoreMessages = async () => {
      try {
        const newMessages = await getMessages(chat.id, offset, limit);

        // Check if there are more messages
        if (newMessages.length > 0) {
          setMessages((prevMessages) => [...newMessages, ...prevMessages]);
        } else {
          setHasMoreMessages(false);
        }
      } catch (error) {
        console.error(error);
        setHasMoreMessages(false);
      }
    };
    // Load more messages when offset changes
    if (offset > 1) {
      loadMoreMessages();
    }
  }, [offset, chat]);

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

  const handleScroll = (event) => {
    if (!isChatCollapsed) {
      setScrollPosition(event.target.scrollTop);
    }

    if (event.target.scrollTop === 0) {
      if (hasMoreMessages) {
        setOffset((prevOffset) => prevOffset + 1);
      }
    }
  };

  // Scrolls back to the previous scroll position when chat new messages are loaded
  useEffect(() => {
    localStorage.setItem(chatCollapsedKey, isChatCollapsed);
    if (isChatCollapsed) {
      return;
    }

    const chatContainer = document.querySelector('.MuiCardContent-root');

    if (scrollPosition === 0) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      chatContainer.scrollTop = scrollPosition;
    }
  }, [isChatCollapsed, chatCollapsedKey]);

  useEffect(() => {
    if (isChatCollapsed) {
      return;
    }
    // Scroll to the bottom when messages are updated
    const chatContainer = document.querySelector('.MuiCardContent-root');
    const scrollDifference = chatContainer.scrollHeight - prevScrollHeight;

    if (scrollDifference > 0) {
      chatContainer.scrollTop += scrollDifference;
      setPrevScrollHeight(chatContainer.scrollHeight);
    }
  }, [messages, prevScrollHeight, isChatCollapsed]);

  const renderChatBody = () => {
    if (isChatCollapsed) {
      return;
    }
    return (
      <>
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
              userIsSender={user.username === msg.sender.username}
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
          <Button onClick={handleSendMessage} className="send-button">
            Send
          </Button>
        </CardActions>
      </>
    );
  };

  // Use MUi card for chat

  return (
    <Card
      style={{
        textAlign: 'left',
        backgroundColor: '#31084A',
        width: isChatCollapsed ? '200px' : '600px',
        height: isChatCollapsed ? '40px' : '800px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        bottom: '0',
        right: '5%',
        transition: 'height 0.3s ease, width 0.3s ease',
        animation: isNewMessageReceived
          ? 'sparkle 1s ease-in-out infinite'
          : 'none',
      }}
    >
      <Button
        onClick={() => {
          setIsChatCollapsed(!isChatCollapsed);
          if (onChatCollapse) {
            onChatCollapse(); // Call the onChatCollapse function from props
          }
        }}
      >
        {isChatCollapsed ? 'Expand Chat' : 'Collapse Chat'}
      </Button>
      {renderChatBody()}
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