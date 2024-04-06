import { useState, useEffect } from 'react';
import UserContext from './userContext';
import UserService from '../services/userService';
import { startConnection, stopConnection } from '../services/signalrService';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const fetchCurrentUser = async (token) => {
    try {
      if (token) {
        const currentUser = await UserService.getUserprofile('current');
        setUser(currentUser);
        startConnection();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error.message);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser(token);
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    startConnection();
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    stopConnection();
  };

  const refreshUser = async () => {
    fetchCurrentUser(token);
  };

  // Listen for changes in local storage token
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        setToken(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, token, login, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
