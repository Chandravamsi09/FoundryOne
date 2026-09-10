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

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [statsData, tasksData, projectsData, notifsData] = await Promise.all([
          employeeService.getDashboardStats(),
          employeeService.getTasks({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
          employeeService.getProjects(),
          employeeService.getNotifications(),
        ]);
        setStats(statsData);
        setRecentTasks(tasksData.data);
        setRecentProjects(projectsData.slice(0, 3));
        setNotifications(notifsData.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Employee Dashboard" navItems={navItems}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Employee Dashboard" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome, Employee</h2>
        <p className="text-sm text-slate-500 mt-1">Here is your work overview</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Tasks" value={stats.totalTasks} color="blue" onClick={() => navigate('/employee/tasks')} />
          <StatCard title="Completed" value={stats.completedTasks} color="green" onClick={() => navigate('/employee/tasks')} />
          <StatCard title="In Progress" value={stats.inProgressTasks} color="purple" onClick={() => navigate('/employee/tasks')} />
          <StatCard title="Pending" value={stats.pendingTasks} color="orange" onClick={() => navigate('/employee/tasks')} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Recent Tasks">
          <ul className="divide-y divide-slate-100">
            {recentTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-slate-700 truncate">{task.title}</span>
                </div>
                <StatusBadge status={task.status} />
              </li>
            ))}
          </ul>
          {recentTasks.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No tasks yet</p>}
        </Section>

        <Section title="My Projects">
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id}>
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
          {recentProjects.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No projects yet</p>}
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Recent Notifications">
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className={`flex items-start gap-3 p-2 rounded-lg ${notif.read ? 'bg-slate-50' : 'bg-blue-50'}`}>
                <span className="text-lg" aria-hidden="true">
                  {notif.type === 'project' ? '🚀' : notif.type === 'message' ? '💬' : notif.type === 'task' ? '📋' : notif.type === 'leave' ? '🏖️' : '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                  <p className="text-xs text-slate-500 truncate">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
          {notifications.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No notifications</p>}
          <div className="mt-3 text-center">
            <button onClick={() => navigate('/employee/notifications')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all notifications
            </button>
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}
