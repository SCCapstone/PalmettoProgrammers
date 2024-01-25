import { useState, useEffect } from 'react';
import UserContext from './userContext';
import UserService from '../services/userService';
import { startConnection, stopConnection } from '../services/signalrService';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (token) {
          const currentUser = await UserService.getUserprofile('current');
          console.log(currentUser);
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

    fetchCurrentUser();
  }, [token]);

  const login = (newToken) => {
    console.log('token');
    console.log(newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    startConnection();
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    stopConnection();
  };

  // useEffect(() => {
  //   // Redirect to home page if the user is not null
  //   if (user) {
  //     navigate('/home');
  //   }
  // }, [user, navigate]);

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
