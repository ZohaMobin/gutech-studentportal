import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = () => {
  
  const { isAuthenticated, token, currentUser } = useAuth();
  console.log("Auth check: ", isAuthenticated);


  if (!token || !currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
