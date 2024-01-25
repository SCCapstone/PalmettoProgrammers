import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/userContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  return user ? children : <Navigate to="/signin" />;
};
