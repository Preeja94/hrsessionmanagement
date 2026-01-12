import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If role is required, check if user has the required role
  if (requiredRole) {
    const userRole = user?.role;
    const isAdmin = userRole === 'admin' || userRole === 'hr_admin';
    const isEmployee = userRole === 'employee' || (!isAdmin && userRole);

    if (requiredRole === 'admin' && !isAdmin) {
      // Employee trying to access admin route - redirect to employee dashboard
      return <Navigate to="/employee-dashboard" replace />;
    }

    if (requiredRole === 'employee' && !isEmployee) {
      // Admin trying to access employee route - redirect to admin dashboard
      return <Navigate to="/admin-dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
