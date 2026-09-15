import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import { Notification, NotificationType } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

const filterOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'task', label: 'Tasks' },
  { value: 'project', label: 'Projects' },
  { value: 'leave', label: 'Leave' },
  { value: 'message', label: 'Messages' },
];

export default function EmployeeNotifications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await employeeService.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await employeeService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError('Failed to mark all notifications as read');
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const iconMap: Record<NotificationType, string> = {
    task: '📋',
    project: '🚀',
    leave: '🏖️',
    attendance: '📅',
    message: '💬',
    system: '🔔',
  };

  return (
    <DashboardLayout title="Notifications" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <Button size="sm" variant="secondary" onClick={handleMarkAllRead}>Mark all read</Button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => { if (notif.link) navigate(notif.link); }}
                className={`flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{iconMap[notif.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                    <span className="text-xs text-slate-400 flex-shrink-0">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{notif.message}</p>
                </div>
                {!notif.read && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                    className="text-xs text-blue-600 hover:text-blue-700 flex-shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">No notifications found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
