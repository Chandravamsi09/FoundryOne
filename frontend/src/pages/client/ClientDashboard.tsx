import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const navItems = [
  { path: '/client/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/client/projects', label: 'My Projects', icon: '🚀' },
  { path: '/client/deliverables', label: 'Deliverables', icon: '📦' },
  { path: '/client/messages', label: 'Messages', icon: '💬' },
  { path: '/client/support', label: 'Support', icon: '🎫' },
  { path: '/client/profile', label: 'Profile', icon: '👤' },
];

const StatCard = ({ title, value, color = 'blue' }: { title: string; value: string; color?: string }) => {
  const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600' };
  const emojis: Record<string, string> = { blue: '🚀', green: '✅', purple: '📦', orange: '⏳' };
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

export default function ClientDashboard() {
  return (
    <DashboardLayout title="Client Dashboard" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome, Client</h2>
        <p className="text-sm text-slate-500 mt-1">Here is your project status</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="My Projects" value="4" color="blue" />
        <StatCard title="Active Projects" value="3" color="green" />
        <StatCard title="Completed Projects" value="1" color="purple" />
        <StatCard title="Pending Deliverables" value="6" color="orange" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Project Status">
          <div className="space-y-4">
            {[
              { name: 'E-commerce Platform', status: 'In Progress', progress: 72 },
              { name: 'CRM Integration', status: 'In Progress', progress: 45 },
              { name: 'Mobile App', status: 'In Progress', progress: 88 },
              { name: 'Data Migration', status: 'Completed', progress: 100 },
            ].map((project, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-900">{project.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>{project.status}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Recent Updates">
          <ul className="divide-y divide-slate-100">
            {[
              { text: 'Design mockups approved', time: '1 hour ago' },
              { text: 'API endpoints delivered', time: '3 hours ago' },
              { text: 'Sprint demo scheduled', time: '1 day ago' },
              { text: 'Invoice #INV-2024-001 paid', time: '2 days ago' },
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-slate-700">{item.text}</span>
                <span className="text-xs text-slate-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
      <div className="mt-6">
        <Section title="Messages">
          <div className="space-y-3">
            {[
              { from: 'Project Manager', text: 'Weekly sync scheduled for Friday', time: '2h ago' },
              { from: 'Dev Team', text: 'API integration completed', time: '5h ago' },
              { from: 'Support', text: 'Your ticket #452 has been resolved', time: '1d ago' },
            ].map((msg, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                  {msg.from.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{msg.from}</p>
                    <span className="text-xs text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-sm text-slate-600">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}