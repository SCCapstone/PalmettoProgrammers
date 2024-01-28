import * as signalR from '@microsoft/signalr';
import config from '../config';
const CHAT_HUB_URL = config.CHAT_HUB_URL;

export const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl(CHAT_HUB_URL, {
    accessTokenFactory: () => localStorage.getItem('token'),
  })
  .build();

export const startConnection = async () => {
  try {
    // Only start if connection is not in the Connected state
    if (hubConnection.state === signalR.HubConnectionState.Disconnected) {
      await hubConnection.start();
      console.log('SignalR connection started.');
    }
  } catch (err) {
    console.error('Error starting SignalR connection:', err);
  }
};

export const stopConnection = async () => {
  try {
    // Only stop if connection is not in the Disconnected state
    if (hubConnection.state === signalR.HubConnectionState.Connected) {
      await hubConnection.stop();
      console.log('SignalR connection stopped.');
    }
  } catch (err) {
    console.error('Error stopping SignalR connection:', err);
  }
};

export const joinChatGroup = async (chatId) => {
  try {
    // parse chatId to int
    // await hubConnection.start();
    chatId = parseInt(chatId);
    await hubConnection.invoke('JoinChatGroup', chatId);
    console.log(`Joined chat group: ${chatId}`);
  } catch (err) {
    console.error('Error joining chat group:', err);
  }
};

export const leaveChatGroup = async (chatId) => {
  try {
    // parse chatId to int
    chatId = parseInt(chatId);
    await hubConnection.invoke('LeaveChatGroup', chatId);
    console.log(`Left chat group: ${chatId}`);
  } catch (err) {
    console.error('Error leaving chat group:', err);
  }
};

export default hubConnection;
