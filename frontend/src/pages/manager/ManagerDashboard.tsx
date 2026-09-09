import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const navItems = [
  { path: '/manager/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/manager/team', label: 'My Team', icon: '👥' },
  { path: '/manager/projects', label: 'Projects', icon: '🚀' },
  { path: '/manager/tasks', label: 'Tasks', icon: '✅' },
  { path: '/manager/reports', label: 'Reports', icon: '📈' },
  { path: '/manager/messages', label: 'Messages', icon: '💬' },
  { path: '/manager/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/manager/profile', label: 'Profile', icon: '👤' },
];

const StatCard = ({ title, value, color = 'blue' }: { title: string; value: string; color?: string }) => {
  const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600' };
  const emojis: Record<string, string> = { blue: '👥', green: '🚀', purple: '✅', orange: '⏳' };
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

export default function ManagerDashboard() {
  return (
    <DashboardLayout title="Manager Dashboard" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome, Manager</h2>
        <p className="text-sm text-slate-500 mt-1">Here is your team and project overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Team Members" value="12" color="blue" />
        <StatCard title="Active Projects" value="6" color="green" />
        <StatCard title="Pending Tasks" value="18" color="orange" />
        <StatCard title="Completed Tasks" value="43" color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Team Overview">
          <div className="space-y-3">
            {[
              { name: 'Sarah Chen', role: 'Senior Dev', tasks: 8 },
              { name: 'James Wilson', role: 'Designer', tasks: 5 },
              { name: 'Emma Davis', role: 'QA Engineer', tasks: 3 },
              { name: 'Mike Brown', role: 'DevOps', tasks: 6 },
            ].map((member, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">{member.tasks} tasks</span>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Project Overview">
          <div className="space-y-3">
            {[
              { name: 'Platform Migration', progress: 60 },
              { name: 'Mobile App v2', progress: 85 },
              { name: 'API Revamp', progress: 30 },
              { name: 'Data Analytics', progress: 95 },
            ].map((project, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{project.name}</span>
                  <span className="text-slate-500">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <div className="mt-6">
        <Section title="Recent Activity">
          <ul className="divide-y divide-slate-100">
            {[
              { text: 'Project milestone approved', time: '30 min ago' },
              { text: 'Team standup completed', time: '2 hours ago' },
              { text: 'Client feedback received', time: '5 hours ago' },
              { text: 'New task assigned to team', time: '1 day ago' },
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-slate-700">{item.text}</span>
                <span className="text-xs text-slate-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </DashboardLayout>
  );
}