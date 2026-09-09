import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const navItems = [
  { path: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/team', label: 'Team', icon: '👥' },
  { path: '/employee/messages', label: 'Messages', icon: '💬' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

const StatCard = ({ title, value, color = 'blue' }: { title: string; value: string; color?: string }) => {
  const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600' };
  const emojis: Record<string, string> = { blue: '🚀', green: '✅', purple: '⏳', orange: '📋' };
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

export default function EmployeeDashboard() {
  return (
    <DashboardLayout title="Employee Dashboard" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome, Employee</h2>
        <p className="text-sm text-slate-500 mt-1">Here is your work overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="My Projects" value="8" color="blue" />
        <StatCard title="My Tasks" value="24" color="green" />
        <StatCard title="Completed Tasks" value="17" color="purple" />
        <StatCard title="Pending Tasks" value="7" color="orange" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Recent Projects">
          <div className="space-y-3">
            {[
              { name: 'Website Redesign', progress: 75 },
              { name: 'API Integration', progress: 40 },
              { name: 'Mobile App Update', progress: 90 },
            ].map((project, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{project.name}</span>
                  <span className="text-slate-500">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="My Tasks">
          <ul className="divide-y divide-slate-100">
            {[
              { task: 'Complete login module', status: 'In Progress' },
              { task: 'Fix navigation bug', status: 'Pending' },
              { task: 'Write unit tests', status: 'Completed' },
              { task: 'Review PR #24', status: 'Pending' },
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-slate-700">{item.task}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>{item.status}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
      <div className="mt-6">
        <Section title="Notifications">
          <div className="space-y-3">
            {[
              { text: 'Project milestone due tomorrow', type: 'deadline' },
              { text: 'New message from Manager', type: 'message' },
              { text: 'Task assigned: Code Review', type: 'task' },
            ].map((notif, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
                <span className="text-lg" aria-hidden="true">
                  {notif.type === 'deadline' ? '⏰' : notif.type === 'message' ? '💬' : '📋'}
                </span>
                <span className="text-sm text-slate-700">{notif.text}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}