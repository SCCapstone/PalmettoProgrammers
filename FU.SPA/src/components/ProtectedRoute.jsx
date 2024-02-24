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
      // See #281: We need to wait for the user to be set before rendering the children
      await new Promise((resolve) => setTimeout(resolve, 80));
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
