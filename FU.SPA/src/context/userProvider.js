import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from './UserContext';
import { getCurrentUser } from '../services/auth-service';
import { startConnection, stopConnection } from '../services/signlarService';


const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const history = useHistory();
  
    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          if (token) {
            const currentUser = await getCurrentUser(token);
            setUser(currentUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching current user:", error.message);
          setUser(null);
        }
      };
  
      fetchCurrentUser();
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
  
    useEffect(() => {
      // Redirect to home page if the user is not null
      if (user) {
        history.push('/home');
      }
    }, [user, history]);
  
    return (
      <UserContext.Provider value={{ user, token, login, logout }}>
        {children}
      </UserContext.Provider>
    );
  };
  
  export default UserProvider;

