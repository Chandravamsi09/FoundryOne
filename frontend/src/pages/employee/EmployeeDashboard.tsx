import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/employee/StatCard';
import Section from '../../components/employee/Section';
import StatusBadge from '../../components/employee/StatusBadge';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { DashboardStats, Task, Project, Notification } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/tasks/board', label: 'Task Board', icon: '📋' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
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

import { useLocation } from 'react-router-dom';

const EmployeeProjectsView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-slate-900">My Assigned Projects</h3>
        <p className="text-sm text-slate-500">Track and manage your specific project contributions.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">Website Redesign</h4>
            <p className="text-sm text-slate-500">Frontend Development</p>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">In Progress</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full w-[75%]"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 mt-3">
          <span>My Progress: 75%</span>
          <span>Role: Lead Dev</span>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">API Integration</h4>
            <p className="text-sm text-slate-500">Backend Engineering</p>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">In Progress</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full w-[40%]"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 mt-3">
          <span>My Progress: 40%</span>
          <span>Role: Support Dev</span>
        </div>
      </div>
    </div>
  </div>
);

const EmployeeTasksView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-slate-900">Task Board</h3>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">Add Task</button>
    </div>
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden p-6">
      <ul className="divide-y divide-slate-100">
        {[
          { task: 'Complete login module', status: 'In Progress', due: 'Tomorrow' },
          { task: 'Fix navigation bug on mobile', status: 'Pending', due: 'In 2 days' },
          { task: 'Write unit tests for AuthContext', status: 'Completed', due: 'Yesterday' },
          { task: 'Review PR #24 from Alex', status: 'Pending', due: 'Today' },
        ].map((item, i) => (
          <li key={i} className="flex items-center justify-between py-4">
            <div>
              <span className="text-sm font-medium text-slate-900">{item.task}</span>
              <p className="text-xs text-slate-500 mt-1">Due: {item.due}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              item.status === 'Completed' ? 'bg-green-100 text-green-700' :
              item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
            }`}>{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const EmployeeProfileView = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-bold text-slate-900">My Profile</h3>
      <p className="text-sm text-slate-500">Manage your personal information, security, and preferences.</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 space-y-6">
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg ring-4 ring-blue-50">
            E
          </div>
          <h4 className="text-lg font-bold text-slate-900">Employee User</h4>
          <p className="text-sm text-slate-500 mb-4">employee@foundryone.com</p>
          <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold px-3 py-1 rounded-full">Employee Account</span>
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
              <input type="text" defaultValue="Employee User" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input type="email" defaultValue="employee@foundryone.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none text-slate-500 cursor-not-allowed shadow-sm" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <input type="text" defaultValue="Engineering" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input type="tel" defaultValue="+1 (555) 987-6543" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm" />
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
                <p className="text-xs text-slate-500 mt-0.5">Receive updates about task assignments and reviews.</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
              <div>
                <p className="text-sm font-medium text-slate-900">SMS Alerts</p>
                <p className="text-xs text-slate-500 mt-0.5">Get text messages for urgent task deadlines.</p>
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

const EmployeeTeamView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-slate-900">My Team</h3>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">Message Team</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { name: 'Sarah Manager', role: 'Project Manager', status: 'Online', email: 'sarah@foundryone.com' },
        { name: 'Alex Dev', role: 'Senior Developer', status: 'In a meeting', email: 'alex@foundryone.com' },
        { name: 'Employee User', role: 'Frontend Engineer', status: 'Online', email: 'employee@foundryone.com' },
        { name: 'Jessica Designer', role: 'UI/UX Designer', status: 'Offline', email: 'jessica@foundryone.com' },
      ].map((member, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
            {member.name.charAt(0)}
          </div>
          <h4 className="font-bold text-slate-900">{member.name}</h4>
          <p className="text-xs text-slate-500 mb-2">{member.role}</p>
          <p className="text-xs text-slate-400 mb-4">{member.email}</p>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            member.status === 'Online' ? 'bg-green-100 text-green-700' :
            member.status === 'Offline' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-700'
          }`}>{member.status}</span>
        </div>
      ))}
    </div>
  </div>
);

const EmployeeMessagesView = () => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-900">Internal Communications</h3>
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-2">
      {[
        { from: 'Sarah Manager', title: 'Sprint Planning', desc: 'Please review the backlog before our 10AM standup.', time: '1h ago' },
        { from: 'Alex Dev', title: 'PR #24 Review', desc: 'I left a few comments on the auth flow. Let me know when resolved.', time: '3h ago' },
        { from: 'HR Department', title: 'Upcoming Holiday', desc: 'A reminder that the office will be closed next Monday.', time: '1d ago' },
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

const EmployeeNotificationsView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
      <button className="text-blue-600 text-sm font-medium hover:underline">Mark all as read</button>
    </div>
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-4 space-y-4">
      {[
        { text: 'Task "Complete login module" was marked as High Priority.', type: 'alert', time: '10 mins ago' },
        { text: 'Sarah mentioned you in "Website Redesign" project.', type: 'mention', time: '1 hour ago' },
        { text: 'Your PR #23 was successfully merged.', type: 'success', time: '2 hours ago' },
        { text: 'Daily standup meeting starts in 15 minutes.', type: 'reminder', time: 'Yesterday' },
      ].map((notif, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm ${
            notif.type === 'alert' ? 'bg-orange-100 text-orange-600' :
            notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {notif.type === 'alert' ? '⚠️' : notif.type === 'success' ? '✅' : notif.type === 'mention' ? '💬' : '⏰'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">{notif.text}</p>
            <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function EmployeeDashboard() {
  const location = useLocation();
  const path = location.pathname;
  
  const currentNav = navItems.find(item => item.path === path);
  
  const renderContent = () => {
    if (path.includes('/projects')) return <EmployeeProjectsView />;
    if (path.includes('/tasks')) return <EmployeeTasksView />;
    if (path.includes('/profile')) return <EmployeeProfileView />;
    if (path.includes('/team')) return <EmployeeTeamView />;
    if (path.includes('/messages')) return <EmployeeMessagesView />;
    if (path.includes('/notifications')) return <EmployeeNotificationsView />;
    
    // Default Main Dashboard
    return (
      <>
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
      </>
    );
  };

  return (
    <DashboardLayout title={currentNav ? currentNav.label : 'Employee Dashboard'} navItems={navItems}>
      {renderContent()}
    </DashboardLayout>
  );
}
