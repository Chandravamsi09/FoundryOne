import React from 'react';
import DashboardLayout from './DashboardLayout';
import { ROUTES } from '../types/constants';

const adminNavItems = [
  { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/organizations', label: 'Organizations', icon: '🏢' },
  { path: '/admin/projects', label: 'Projects', icon: '🚀' },
  { path: '/admin/reports', label: 'Reports', icon: '📈' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📉' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { path: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' },
];

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <DashboardLayout title={title} navItems={adminNavItems}>
      {children}
    </DashboardLayout>
  );
}
