import React, { useState, useEffect } from 'react';
import { AdminStats } from '../../types/admin';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';
import ErrorMessage from '../../components/ErrorMessage';

const StatCard = ({ title, value, color = 'blue' }: { title: string; value: string | number; color?: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600', red: 'bg-red-50 text-red-600',
  };
  const emojis: Record<string, string> = { blue: '👥', green: '💼', purple: '📊', orange: '🤝', red: '🚀' };
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${colors[color]} flex items-center justify-center text-xl`}>{emojis[color]}</div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
    <h3 className="text-base font-semibold text-slate-900 mb-4">{title}</h3>
    {children}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>({
    totalUsers: 142,
    totalEmployees: 45,
    totalManagers: 12,
    totalClients: 85,
    activeProjects: 38,
    completedProjects: 156,
    pendingApprovals: 9,
    recentLogins: 42,
    systemHealth: {
      cpu: 45,
      memory: 68,
      storage: 32
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome, Admin</h2>
        <p className="text-sm text-slate-500 mt-1">Here is your system overview</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div className="p-12 flex justify-center"><div className="animate-spin text-blue-600 h-8 w-8" /></div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
            <StatCard title="Employees" value={stats.totalEmployees} color="green" />
            <StatCard title="Managers" value={stats.totalManagers} color="purple" />
            <StatCard title="Clients" value={stats.totalClients} color="orange" />
            <StatCard title="Active Projects" value={stats.activeProjects} color="red" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="System Health">
              <div className="space-y-3">
                {[
                  { label: 'CPU Usage', value: stats.systemHealth.cpu, color: 'bg-blue-600' },
                  { label: 'Memory Usage', value: stats.systemHealth.memory, color: 'bg-green-600' },
                  { label: 'Storage', value: stats.systemHealth.storage, color: 'bg-purple-600' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Quick Stats">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <p className="text-sm text-slate-500">Completed Projects</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.completedProjects}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <p className="text-sm text-slate-500">Pending Approvals</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.pendingApprovals}</p>
                </div>
              </div>
            </Section>
          </div>
        </>
      ) : null}
    </AdminLayout>
  );
}
