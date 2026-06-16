import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Redirect to admin login screen if unauthorized
    return <Navigate to="/admin/login" replace />;
  }

  // Render sub-routes if authorized
  return <Outlet />;
};

export default ProtectedRoute;
