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
const ClientProjects = React.lazy(() => import('../pages/client/projects/ClientProjects'));
const ClientProjectDetail = React.lazy(() => import('../pages/client/projects/ClientProjectDetail'));
const ClientContracts = React.lazy(() => import('../pages/client/contracts/ClientContracts'));
const ClientContractDetail = React.lazy(() => import('../pages/client/contracts/ClientContractDetail'));
const ClientInvoices = React.lazy(() => import('../pages/client/invoices/ClientInvoices'));
const ClientInvoiceDetail = React.lazy(() => import('../pages/client/invoices/ClientInvoiceDetail'));
const ClientPayments = React.lazy(() => import('../pages/client/payments/ClientPayments'));
const ClientSupport = React.lazy(() => import('../pages/client/support/ClientSupport'));
const ClientSupportCreate = React.lazy(() => import('../pages/client/support/ClientSupportCreate'));
const ClientSupportDetail = React.lazy(() => import('../pages/client/support/ClientSupportDetail'));
const ClientProfile = React.lazy(() => import('../pages/client/profile/ClientProfile'));
const ClientNotifications = React.lazy(() => import('../pages/client/notifications/ClientNotifications'));

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
        <Route path={ROUTES.CLIENT_PROJECTS} element={<LazyWrapper><ClientProjects /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_PROJECT_DETAIL} element={<LazyWrapper><ClientProjectDetail /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_CONTRACTS} element={<LazyWrapper><ClientContracts /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_CONTRACT_DETAIL} element={<LazyWrapper><ClientContractDetail /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_INVOICES} element={<LazyWrapper><ClientInvoices /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_INVOICE_DETAIL} element={<LazyWrapper><ClientInvoiceDetail /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_PAYMENTS} element={<LazyWrapper><ClientPayments /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_SUPPORT} element={<LazyWrapper><ClientSupport /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_SUPPORT_CREATE} element={<LazyWrapper><ClientSupportCreate /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_SUPPORT_DETAIL} element={<LazyWrapper><ClientSupportDetail /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_PROFILE} element={<LazyWrapper><ClientProfile /></LazyWrapper>} />
        <Route path={ROUTES.CLIENT_NOTIFICATIONS} element={<LazyWrapper><ClientNotifications /></LazyWrapper>} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
}
