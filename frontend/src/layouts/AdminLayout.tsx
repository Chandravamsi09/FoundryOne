import React from 'react';
import DashboardLayout from './DashboardLayout';
import { ROUTES } from '../types/constants';

import { LayoutDashboard, Users, Building2, FolderGit2, FileText, PieChart, Settings, ClipboardList } from 'lucide-react';

const adminNavItems = [
  { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
  { path: '/admin/organizations', label: 'Organizations', icon: <Building2 size={20} /> },
  { path: '/admin/projects', label: 'Projects', icon: <FolderGit2 size={20} /> },
  { path: '/admin/reports', label: 'Reports', icon: <FileText size={20} /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  { path: '/admin/audit-logs', label: 'Audit Logs', icon: <ClipboardList size={20} /> },
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
