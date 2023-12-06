import {
  Button,
  TextField,
  Link,
  Box,
  Container,
  Typography,
  CssBaseline,
  Avatar,
} from '@mui/material';
import { joinChatGroup, leaveChatGroup, startConnection, hubConnection } from "../../services/signalrService";
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChat, getMessages, saveMessage } from "../../services/chatService";
import './Chat.css';

export default function Chat() {
    const { chatId: chatId } = useParams();
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [offset, setOffset] = useState(1);
    const [limit, setLimit] = useState(25);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    const chatContainerRef = useRef(null);

    useEffect(() => {
      console.log('entering use effect');
      initializeChat();

      hubConnection.on('ReceiveMessage', handleReceiveMessage);

      chatContainerRef.current.addEventListener('scroll', handleScroll);
      
      return () => {
        // ComponentWillUnmount - Leave the chat group
        hubConnection.off('ReceiveMessage', handleReceiveMessage);
        //chatContainerRef.current.removeEventListener('scroll', handleScroll);
        leaveChatGroup(chatId);
      };
    }, [chatId]);

    async function initializeChat() {
      try {
        const chat = await getChat(chatId);
        setChat(chat);
        startConnection();
        console.log('joining chat group')
        joinChatGroup(chatId);
        const messages = await getMessages(chatId, offset, limit);
        setMessages(messages);
        // setOffset(prevOffset => prevOffset + 1);
      } catch (error) {
        console.error(error);
      }
    }

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
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    };

    useEffect(() => {
      // Re-establish SignalR connection when messages are updated
      startConnection();
      joinChatGroup(chatId);
    }, [messages]);
  

    const handleScroll = () => {
      const chatContainer = chatContainerRef.current;
    
      // Check if the user has reached the top of the chat with a tolerance of 10 pixels
      if (chatContainer.scrollTop <= 10) {
        // Load more messages when reaching the top
        if (hasMoreMessages) {
          setOffset(prevOffset => prevOffset + 1);
        }
      }
    };    

    const loadMoreMessages = async () => {
      try {
        const newMessages = await getMessages(chatId, offset, limit);
    
        // Check if there are more messages
        if (newMessages.length > 0) {
          setMessages(prevMessages => [...newMessages, ...prevMessages]);
        } else {
          setHasMoreMessages(false);
        }
      } catch (error) {
        console.error(error);
      }
    };    
  
    useEffect(() => {
      // Load more messages when offset changes
      if (offset > 1) {
        loadMoreMessages();
      }
    }, [offset]); 
    
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
            <p key={index}>{msg.senderName}: {msg.content}</p>
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
  
    