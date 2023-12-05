import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  let auth = { token: true };
  return auth.token ? <Outlet /> : <Navigate to="/sigin" />;
};
