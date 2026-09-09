import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES, ROLES } from '../types/constants';

const LandingPage = React.lazy(() => import('../pages/LandingPage'));
const AdminLogin = React.lazy(() => import('../pages/AdminLogin'));
const EmployeeLogin = React.lazy(() => import('../pages/EmployeeLogin'));
const ManagerLogin = React.lazy(() => import('../pages/ManagerLogin'));
const ClientLogin = React.lazy(() => import('../pages/ClientLogin'));
const Register = React.lazy(() => import('../pages/Register'));

const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
const EmployeeDashboard = React.lazy(() => import('../pages/employee/EmployeeDashboard'));
const ManagerDashboard = React.lazy(() => import('../pages/manager/ManagerDashboard'));
const ClientDashboard = React.lazy(() => import('../pages/client/ClientDashboard'));

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner size="lg" /></div>}>
    {children}
  </Suspense>
);

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path={ROUTES.LANDING} element={<LazyWrapper><LandingPage /></LazyWrapper>} />
      <Route path="/" element={<Navigate to={ROUTES.LANDING} replace />} />

      <Route path={ROUTES.ADMIN_LOGIN} element={<LazyWrapper><AdminLogin /></LazyWrapper>} />
      <Route path={ROUTES.EMPLOYEE_LOGIN} element={<LazyWrapper><EmployeeLogin /></LazyWrapper>} />
      <Route path={ROUTES.MANAGER_LOGIN} element={<LazyWrapper><ManagerLogin /></LazyWrapper>} />
      <Route path={ROUTES.CLIENT_LOGIN} element={<LazyWrapper><ClientLogin /></LazyWrapper>} />
      <Route path={ROUTES.REGISTER} element={<LazyWrapper><Register /></LazyWrapper>} />

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<LazyWrapper><AdminDashboard /></LazyWrapper>} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} />}>
        <Route path={ROUTES.EMPLOYEE_DASHBOARD} element={<LazyWrapper><EmployeeDashboard /></LazyWrapper>} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
        <Route path={ROUTES.MANAGER_DASHBOARD} element={<LazyWrapper><ManagerDashboard /></LazyWrapper>} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={[ROLES.CLIENT]} />}>
        <Route path={ROUTES.CLIENT_DASHBOARD} element={<LazyWrapper><ClientDashboard /></LazyWrapper>} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
}