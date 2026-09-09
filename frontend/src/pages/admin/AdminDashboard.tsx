import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/employees', label: 'Employees', icon: '💼' },
  { path: '/admin/managers', label: 'Managers', icon: '📊' },
  { path: '/admin/clients', label: 'Clients', icon: '🤝' },
  { path: '/admin/projects', label: 'Projects', icon: '🚀' },
  { path: '/admin/reports', label: 'Reports', icon: '📈' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const StatCard = ({ title, value, color = 'blue' }: { title: string; value: string; color?: string }) => {
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
  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome, Admin</h2>
        <p className="text-sm text-slate-500 mt-1">Here is your system overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Users" value="248" color="blue" />
        <StatCard title="Employees" value="142" color="green" />
        <StatCard title="Managers" value="38" color="purple" />
        <StatCard title="Clients" value="68" color="orange" />
        <StatCard title="Active Projects" value="56" color="red" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Recent Activity">
          <ul className="divide-y divide-slate-100">
            {[
              { text: 'New employee registered', time: '2 min ago' },
              { text: 'Project Alpha milestone completed', time: '1 hour ago' },
              { text: 'Client feedback received', time: '3 hours ago' },
              { text: 'Manager account created', time: '5 hours ago' },
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-slate-700">{item.text}</span>
                <span className="text-xs text-slate-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="System Overview">
          <div className="space-y-3">
            {[
              { label: 'CPU Usage', value: 42, color: 'bg-blue-600' },
              { label: 'Memory Usage', value: 68, color: 'bg-green-600' },
              { label: 'Storage', value: 31, color: 'bg-purple-600' },
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
      </div>
      <div className="mt-6">
        <Section title="Quick Actions">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Add User', 'Create Project', 'Generate Report', 'System Settings'].map((action) => (
              <button key={action} className="p-3 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                {action}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}