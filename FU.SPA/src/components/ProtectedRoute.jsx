import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/userContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  // Get the current route
  const currentRoute = window.location.pathname;

  useEffect(() => {
    const delay = async () => {
      var lowerRoute = currentRoute.toLocaleLowerCase();
      var waitTime = 0;
      if (lowerRoute === '/social' || lowerRoute === '/create') {
        waitTime = 80;
      }
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      setIsLoading(false);
    };

    delay();
  }, [currentRoute]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Navigate to={`/signin?returnUrl=${encodeURIComponent(currentRoute)}`} />
    );
  }

  return children;
};
