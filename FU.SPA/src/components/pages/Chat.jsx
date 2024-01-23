import { Button, TextField } from '@mui/material';
import {
  joinChatGroup,
  leaveChatGroup,
  startConnection,
  hubConnection,
} from '../../services/signalrService';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChat, getMessages, saveMessage } from '../../services/chatService';
import './Chat.css';

export default function Chat() {
  const { chatId: chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [offset, setOffset] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const limit = 25;

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const chat = await getChat(chatId);
        setChat(chat);
        startConnection();
        joinChatGroup(chatId);
        const messages = await getMessages(chatId, 1, limit);
        setMessages(messages);
      } catch (error) {
        console.error(error);
      }
    };

    const handleScroll = () => {
      const chatContainer = chatContainerRef.current;

      // Check if the user has reached the top of the chat with a tolerance of 10 pixels
      if (chatContainer.scrollTop <= 10) {
        // Load more messages when reaching the top
        if (hasMoreMessages) {
          setOffset((prevOffset) => prevOffset + 1);
        }
      }
    };

    initializeChat();

    hubConnection.on('ReceiveMessage', handleReceiveMessage);

    chatContainerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      hubConnection.off('ReceiveMessage', handleReceiveMessage);
      leaveChatGroup(chatId);
    };
  }, [chatId, hasMoreMessages]);

  async function handleSendMessage() {
    try {
      if (message === '') {
        console.log('empty message');
        return;
      }
      await saveMessage(message, chatId);
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  }

  const handleReceiveMessage = (receivedMessage) => {
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  };

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
      }
    };
    // Load more messages when offset changes
    if (offset > 1) {
      loadMoreMessages();
    }
  }, [offset, chat]);

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    const chatContainer = chatContainerRef.current;
    const scrollDifference = chatContainer.scrollHeight - prevScrollHeight;

    if (scrollDifference > 0) {
      chatContainer.scrollTop += scrollDifference;
      setPrevScrollHeight(chatContainer.scrollHeight);
    }
  }, [messages, prevScrollHeight]);

  return (
    <div className="chat-wrapper">
      <div ref={chatContainerRef} className="chat-container">
        {messages.map((msg, index) => (
          <p key={index}>
            {msg.senderName}: {msg.content}
          </p>
        ))}
      </div>
      <div className="bottom-bar">
        <TextField
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage} className="send-button">
          Send
        </Button>
      </div>
    </div>
  );
}
