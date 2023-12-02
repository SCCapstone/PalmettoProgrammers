import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  let auth = {'token': false}
  return (
    auth.token ? <Outlet /> : <Navigate to='/sigin'/>
 )
}