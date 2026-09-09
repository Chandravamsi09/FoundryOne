import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/constants';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ allowedRoles = [], requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" />
          <span className="text-sm text-slate-500">Verifying authentication...</span>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login/admin" state={{ from: location }} replace />;
  }

  if (requireAuth && allowedRoles.length > 0 && !allowedRoles.includes(role as Role)) {
    return <Navigate to="/login/admin" replace />;
  }

  return <Outlet />;
}