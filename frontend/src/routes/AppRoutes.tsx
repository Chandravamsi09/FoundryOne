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
const AdminUsers = React.lazy(() => import('../pages/admin/AdminUsers'));
const AdminOrganizations = React.lazy(() => import('../pages/admin/AdminOrganizations'));
const AdminProjects = React.lazy(() => import('../pages/admin/AdminProjects'));
const AdminReports = React.lazy(() => import('../pages/admin/AdminReports'));
const AdminAnalytics = React.lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminSettings = React.lazy(() => import('../pages/admin/AdminSettings'));
const AdminAuditLogs = React.lazy(() => import('../pages/admin/AdminAuditLogs'));

const EmployeeDashboard = React.lazy(() => import('../pages/employee/EmployeeDashboard'));
const EmployeeProjects = React.lazy(() => import('../pages/employee/EmployeeProjects'));
const EmployeeProjectDetails = React.lazy(() => import('../pages/employee/EmployeeProjectDetails'));
const EmployeeTaskBoard = React.lazy(() => import('../pages/employee/EmployeeTaskBoard'));
const EmployeeTasks = React.lazy(() => import('../pages/employee/EmployeeTasks'));
const EmployeeTaskDetails = React.lazy(() => import('../pages/employee/EmployeeTaskDetails'));
const EmployeeAttendance = React.lazy(() => import('../pages/employee/EmployeeAttendance'));
const EmployeeLeave = React.lazy(() => import('../pages/employee/EmployeeLeave'));
const EmployeeNotifications = React.lazy(() => import('../pages/employee/EmployeeNotifications'));
const EmployeeProfile = React.lazy(() => import('../pages/employee/EmployeeProfile'));

const ManagerDashboard = React.lazy(() => import('../pages/manager/ManagerDashboard'));
const ManagerTeam = React.lazy(() => import('../pages/manager/Team'));
const ManagerTeamMember = React.lazy(() => import('../pages/manager/TeamMemberDetail'));
const ManagerProjects = React.lazy(() => import('../pages/manager/Projects'));
const ManagerCreateProject = React.lazy(() => import('../pages/manager/CreateProject'));
const ManagerProjectDetail = React.lazy(() => import('../pages/manager/ProjectDetail'));
const ManagerTasks = React.lazy(() => import('../pages/manager/Tasks'));
const ManagerApprovals = React.lazy(() => import('../pages/manager/Approvals'));
const ManagerReports = React.lazy(() => import('../pages/manager/Reports'));
const ManagerAnalytics = React.lazy(() => import('../pages/manager/Analytics'));
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
        <Route path={ROUTES.ADMIN_USERS} element={<LazyWrapper><AdminUsers /></LazyWrapper>} />
        <Route path={ROUTES.ADMIN_ORGANIZATIONS} element={<LazyWrapper><AdminOrganizations /></LazyWrapper>} />
        <Route path={ROUTES.ADMIN_PROJECTS} element={<LazyWrapper><AdminProjects /></LazyWrapper>} />
        <Route path={ROUTES.ADMIN_REPORTS} element={<LazyWrapper><AdminReports /></LazyWrapper>} />
        <Route path={ROUTES.ADMIN_ANALYTICS} element={<LazyWrapper><AdminAnalytics /></LazyWrapper>} />
        <Route path={ROUTES.ADMIN_SETTINGS} element={<LazyWrapper><AdminSettings /></LazyWrapper>} />
        <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<LazyWrapper><AdminAuditLogs /></LazyWrapper>} />
        <Route path="/admin/*" element={<LazyWrapper><AdminDashboard /></LazyWrapper>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} />}>
        <Route path={ROUTES.EMPLOYEE_DASHBOARD} element={<LazyWrapper><EmployeeDashboard /></LazyWrapper>} />
        <Route path="/employee/*" element={<LazyWrapper><EmployeeDashboard /></LazyWrapper>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
        <Route path={ROUTES.MANAGER_DASHBOARD} element={<LazyWrapper><ManagerDashboard /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_TEAM} element={<LazyWrapper><ManagerTeam /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_TEAM_MEMBER} element={<LazyWrapper><ManagerTeamMember /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_PROJECTS} element={<LazyWrapper><ManagerProjects /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_PROJECTS_CREATE} element={<LazyWrapper><ManagerCreateProject /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_PROJECT_DETAILS} element={<LazyWrapper><ManagerProjectDetail /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_TASKS} element={<LazyWrapper><ManagerTasks /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_APPROVALS} element={<LazyWrapper><ManagerApprovals /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_REPORTS} element={<LazyWrapper><ManagerReports /></LazyWrapper>} />
        <Route path={ROUTES.MANAGER_ANALYTICS} element={<LazyWrapper><ManagerAnalytics /></LazyWrapper>} />
        <Route path="/manager/*" element={<LazyWrapper><ManagerDashboard /></LazyWrapper>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.CLIENT]} />}>
        <Route path={ROUTES.CLIENT_DASHBOARD} element={<LazyWrapper><ClientDashboard /></LazyWrapper>} />
        <Route path="/client/*" element={<LazyWrapper><ClientDashboard /></LazyWrapper>} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
}
