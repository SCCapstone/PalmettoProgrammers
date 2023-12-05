import { joinChatGroup, leaveChatGroup, startConnection } from "../../services/signalrService";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Chat() {
    const { chatId: chatId } = useParams();


    useEffect(() => {
      startConnection();
      joinChatGroup(chatId);
  
      return () => {
        // ComponentWillUnmount - Leave the chat group
        leaveChatGroup(chatId);
      };
    }, []); // Empty dependency array ensures this effect runs only once during component mount
  
    return (
      <div>
        {/* Your chat component JSX */}
      </div>
    );
  }
  