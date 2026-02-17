import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const token = localStorage.getItem('token');

  if (isLoading) {
    return <Spinner />;
  }

  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
