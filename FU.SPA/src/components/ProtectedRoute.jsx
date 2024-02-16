import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/userContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  // Get the current route
  var currentRoute = window.location.pathname;
  console.log('currentRoute: ' + currentRoute);

  return user ? (
    children
  ) : (
    <Navigate to={`/signin?returnUrl=${encodeURIComponent(currentRoute)}`} />
  );
};
