import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import clientService, { ClientNotification, NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_COLORS } from '../../../services/clientService';
import { ROUTES } from '../../../types/constants';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';

const navItems = [
  { path: ROUTES.CLIENT_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.CLIENT_PROJECTS, label: 'My Projects', icon: '🚀' },
  { path: ROUTES.CLIENT_CONTRACTS, label: 'Contracts', icon: '📄' },
  { path: ROUTES.CLIENT_INVOICES, label: 'Invoices', icon: '💳' },
  { path: ROUTES.CLIENT_PAYMENTS, label: 'Payments', icon: '💰' },
  { path: ROUTES.CLIENT_SUPPORT, label: 'Support', icon: '🎫' },
  { path: ROUTES.CLIENT_NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
  { path: ROUTES.CLIENT_PROFILE, label: 'Profile', icon: '👤' },
];

export default function ClientNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingRead, setMarkingRead] = useState<string | null>(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const clientId = (user as any)?.id || 'client_demo_001';
      const data = await clientService.getNotifications(clientId);
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    setMarkingRead(notificationId);
    try {
      const clientId = (user as any)?.id || 'client_demo_001';
      await clientService.markNotificationRead(clientId, notificationId);
      setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, read: true } : n));
    } catch (err: any) {
      setError(err.message || 'Failed to mark notification as read');
    } finally {
      setMarkingRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAllRead(true);
    setSuccess('');
    try {
      const clientId = (user as any)?.id || 'client_demo_001';
      await clientService.markAllNotificationsRead(clientId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setSuccess('All notifications marked as read');
    } catch (err: any) {
      setError(err.message || 'Failed to mark all notifications as read');
    } finally {
      setMarkingAllRead(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout title="Notifications" navItems={navItems} role="client">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} />}
        {success && <div className="p-4 rounded-xl bg-green-50/80 border border-green-200 text-green-700 text-sm">{success}</div>}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500 mt-1">{unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead} loading={markingAllRead} icon={<CheckCheck className="w-4 h-4" />}>
              Mark All as Read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" />
              <span className="text-sm text-slate-500">Loading notifications...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className={`bg-white/70 backdrop-blur-xl rounded-2xl border p-5 shadow-sm transition-all duration-300 ${notification.read ? 'border-white/40 opacity-75' : 'border-blue-200/60 bg-blue-50/20'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.read ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900">{notification.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${NOTIFICATION_TYPE_COLORS[notification.type]}`}>
                        {NOTIFICATION_TYPE_LABELS[notification.type]}
                      </span>
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{new Date(notification.createdAt).toLocaleString()}</span>
                      {notification.link && (
                        <button onClick={() => navigate(notification.link!)} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                          View <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  {!notification.read && (
                    <button onClick={() => handleMarkAsRead(notification.id)} disabled={markingRead === notification.id} className="text-xs text-slate-400 hover:text-slate-600 font-medium flex-shrink-0">
                      {markingRead === notification.id ? '...' : 'Mark as read'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
