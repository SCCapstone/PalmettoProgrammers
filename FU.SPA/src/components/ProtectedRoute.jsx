import React, { useContext } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import UserContext from '../context/userContext';

export const ProtectedRoute = ( { children} ) => {
  const { user } = useContext(UserContext);

  console.log('user')
  console.log(user);
  return (
    
    user ? children : <Navigate to='/signin'/>
 )
}