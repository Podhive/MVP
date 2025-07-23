import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../context/useAuth';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized\" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;