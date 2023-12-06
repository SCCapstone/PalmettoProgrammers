import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ( { auth, children} ) => {
  return (
    auth ? children : <Navigate to='/signin'/>
 )
}