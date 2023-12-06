import config from "../config";
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

export const saveMessage = async (message, id) => {
    const response = await fetch(`${API_BASE_URL}/chat/${id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
      body: JSON.stringify(message),
    });
  
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to save message.");
    }
};

export const getMessages = async (id, offset = 1, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/chat/${id}/messages?offset=${offset}&limit=${limit}`, {
      method: "GET",
      headers: {
        ...AuthService.getAuthHeader(),
      },
    });
  
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to get messages.");
    }
}

export const getChat = async (id) => {
    const response = await fetch(`${API_BASE_URL}/chat/${id}`, {
      method: "GET",
      headers: {
        ...AuthService.getAuthHeader(),
      },
    });
  
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to get chat.");
    }
}

export const getDirectChat = async (otherUserId) => {
    const response = await fetch(`${API_BASE_URL}/chat/direct/${otherUserId}`, {
      method: "GET",
      headers: {
        ...AuthService.getAuthHeader(),
      },
    });
  
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to get chat.");
    }
}