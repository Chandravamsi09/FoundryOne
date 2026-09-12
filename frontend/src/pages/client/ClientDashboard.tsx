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

import { useLocation } from 'react-router-dom';

const ProjectsView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-slate-900">My Projects</h3>
        <p className="text-sm text-slate-500">Track and manage your ongoing project lifecycles.</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">Request New Project</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">E-commerce Platform</h4>
            <p className="text-sm text-slate-500">Web Development</p>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">In Progress</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full w-[72%]"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 mt-3">
          <span>Progress: 72%</span>
          <span>Target: Oct 15</span>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">CRM Integration</h4>
            <p className="text-sm text-slate-500">API & Backend</p>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">In Progress</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full w-[45%]"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 mt-3">
          <span>Progress: 45%</span>
          <span>Target: Nov 01</span>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">Mobile App</h4>
            <p className="text-sm text-slate-500">iOS & Android</p>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">In Progress</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full w-[88%]"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 mt-3">
          <span>Progress: 88%</span>
          <span>Target: Sep 30</span>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">Data Migration</h4>
            <p className="text-sm text-slate-500">Database Engineering</p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
          <div className="bg-green-500 h-2.5 rounded-full w-full"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 mt-3">
          <span>Progress: 100%</span>
          <span>Completed: Sep 01</span>
        </div>
      </div>
    </div>
  </div>
);

const DeliverablesView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Deliverables</h3>
        <p className="text-sm text-slate-500">Access and review project files and assets.</p>
      </div>
    </div>
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th className="p-4 font-semibold text-slate-700">Asset Name</th>
            <th className="p-4 font-semibold text-slate-700">Project</th>
            <th className="p-4 font-semibold text-slate-700">Date Uploaded</th>
            <th className="p-4 font-semibold text-slate-700">Status</th>
            <th className="p-4 font-semibold text-slate-700 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[
            { name: 'Homepage_UI_v2.fig', proj: 'E-commerce Platform', date: 'Today, 10:30 AM', status: 'Pending Review', color: 'yellow', icon: '🎨' },
            { name: 'API_Documentation.pdf', proj: 'CRM Integration', date: 'Yesterday', status: 'Approved', color: 'green', icon: '📄' },
            { name: 'Q3_Analytics_Report.xlsx', proj: 'Data Migration', date: 'Sep 05, 2024', status: 'Approved', color: 'green', icon: '📊' },
            { name: 'App_Wireframes.pdf', proj: 'Mobile App', date: 'Aug 28, 2024', status: 'Revisions Requested', color: 'red', icon: '📱' },
          ].map((d, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition">
              <td className="p-4 flex items-center gap-3 font-medium text-slate-800">
                <span className="text-xl">{d.icon}</span> {d.name}
              </td>
              <td className="p-4 text-slate-600">{d.proj}</td>
              <td className="p-4 text-slate-500">{d.date}</td>
              <td className="p-4">
                <span className={`bg-${d.color}-50 text-${d.color}-700 border border-${d.color}-200 px-2.5 py-1 rounded-full text-xs font-medium`}>
                  {d.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MessagesView = () => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-900">Messages & Communications</h3>
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-2">
      {[
        { from: 'Sarah (Project Manager)', title: 'Weekly Sync Update', desc: 'The weekly sync has been moved to Friday at 2 PM. Please review the updated agenda.', time: '2h ago' },
        { from: 'Dev Team', title: 'API Integration Complete', desc: 'We have successfully connected the CRM endpoints. Please test the sandbox environment.', time: '5h ago' },
        { from: 'Alex (Design)', title: 'New Mockups Uploaded', desc: 'The final mobile app wireframes are ready for your review in the Deliverables tab.', time: '1d ago' },
      ].map((msg, i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition cursor-pointer border-b border-slate-50 last:border-0">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {msg.from.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-slate-900">{msg.title}</h4>
              <span className="text-xs text-slate-500 font-medium">{msg.time}</span>
            </div>
            <p className="text-sm text-slate-700 mt-1">{msg.from}</p>
            <p className="text-sm text-slate-500 mt-1 truncate">{msg.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SupportView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-slate-900">Support Tickets</h3>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">Create Ticket</button>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {[
        { id: '#453', title: 'Cannot download Q3 Analytics Report', status: 'Open', urgency: 'High', date: 'Today' },
        { id: '#452', title: 'Update billing email address', status: 'Resolved', urgency: 'Low', date: 'Yesterday' },
        { id: '#449', title: 'API returning 500 error on staging', status: 'Resolved', urgency: 'Critical', date: 'Last Week' },
      ].map((t, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/40 shadow-sm flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className={`p-3 rounded-xl ${t.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
              🎫
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{t.title}</h4>
              <p className="text-xs text-slate-500 mt-1">Ticket {t.id} • {t.date} • Urgency: {t.urgency}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {t.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ProfileView = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-bold text-slate-900">My Profile</h3>
      <p className="text-sm text-slate-500">Manage your personal information, security, and preferences.</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 space-y-6">
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg ring-4 ring-blue-50">
            C
          </div>
          <h4 className="text-lg font-bold text-slate-900">Client User</h4>
          <p className="text-sm text-slate-500 mb-4">client@foundryone.com</p>
          <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold px-3 py-1 rounded-full">Client Account</span>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <button className="w-full bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition shadow-sm mb-3">Upload New Picture</button>
            <button className="w-full bg-white border border-slate-200 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition shadow-sm">Remove Picture</button>
          </div>
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-2 space-y-6">
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" defaultValue="Client User" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input type="email" defaultValue="client@foundryone.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none text-slate-500 cursor-not-allowed shadow-sm" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
              <input type="text" defaultValue="Acme Corporation" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg">Save Profile Changes</button>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-4">Notification Preferences</h4>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
              <div>
                <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                <p className="text-xs text-slate-500 mt-0.5">Receive updates about project milestones and deliverables.</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
              <div>
                <p className="text-sm font-medium text-slate-900">SMS Alerts</p>
                <p className="text-xs text-slate-500 mt-0.5">Get text messages for urgent support ticket updates.</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner border border-slate-300">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ClientDashboard() {
  const location = useLocation();
  const path = location.pathname;
  
  const currentNav = navItems.find(item => item.path === path);
  
  const renderContent = () => {
    if (path.includes('/projects')) return <ProjectsView />;
    if (path.includes('/deliverables')) return <DeliverablesView />;
    if (path.includes('/messages')) return <MessagesView />;
    if (path.includes('/support')) return <SupportView />;
    if (path.includes('/profile')) return <ProfileView />;
    
    // Default Main Dashboard
    return (
      <>
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
      </>
    );
  };

  return (
    <DashboardLayout title={currentNav ? currentNav.label : 'Client Dashboard'} navItems={navItems}>
      {renderContent()}
    </DashboardLayout>
  );
}