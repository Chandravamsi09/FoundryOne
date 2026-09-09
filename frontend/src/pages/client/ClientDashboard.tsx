import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import clientService, { ClientProject, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, mockTickets } from '../../services/clientService';
import { ROUTES } from '../../types/constants';
import { Briefcase, ArrowRight, Users, Calendar, DollarSign, TrendingUp, Plus } from 'lucide-react';

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

const StatCard = ({ title, value, subtext, color = 'blue', icon: Icon }: { title: string; value: string | number; subtext?: string; color?: string; icon?: any }) => {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/50 text-blue-600',
    green: 'from-green-500/10 to-green-600/5 border-green-200/50 text-green-600',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-200/50 text-purple-600',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-200/50 text-orange-600',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-200/50 text-amber-600',
    rose: 'from-rose-500/10 to-rose-600/5 border-rose-200/50 text-rose-600',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colors[color]} p-5 shadow-sm hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5 text-current" />
          </div>
        )}
      </div>
    </div>
  );
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const clientId = (user as any)?.id || 'client_demo_001';
      const [projectsData, invoicesData, notificationsData] = await Promise.all([
        clientService.getProjects(clientId),
        clientService.getInvoices(clientId),
        clientService.getNotifications(clientId),
      ]);
      setProjects(projectsData);
      setInvoices(invoicesData);
      setNotifications(notificationsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter((p) => p.status === 'in_progress');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const pendingInvoices = invoices.filter((inv) => inv.status === 'sent' || inv.status === 'overdue');
  const totalRevenue = invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const unreadNotifications = notifications.filter((n) => !n.read);

  const upcomingMilestones = projects.flatMap((p) => p.milestones.filter((m) => m.status !== 'completed').map((m) => ({ ...m, projectName: p.name, projectId: p.id }))).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5);

  const recentActivity = projects.flatMap((p) => p.recentActivity.map((a) => ({ ...a, projectName: p.name, projectId: p.id }))).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" navItems={navItems} role="client">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-slate-500">Loading dashboard...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" navItems={navItems} role="client">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
            <p className="text-sm text-slate-500 mt-1">Here's what's happening with your projects</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.CLIENT_PROJECTS)} icon={<ArrowRight className="w-4 h-4" />}>
            View All Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Projects" value={projects.length} subtext={`${activeProjects.length} active`} color="blue" icon={Briefcase} />
          <StatCard title="Active Projects" value={activeProjects.length} color="green" icon={TrendingUp} />
          <StatCard title="Completed" value={completedProjects.length} color="purple" icon={Calendar} />
          <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} subtext={`$${totalBudget.toLocaleString()} budget`} color="orange" icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Project Progress</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.CLIENT_PROJECTS)}>View All</Button>
            </div>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No projects found</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`${ROUTES.CLIENT_PROJECTS}/${project.id}`)}>
                          {project.name}
                        </p>
                        <p className="text-xs text-slate-500">{project.managerName}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{project.progress}% complete</span>
                      <span>${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Upcoming Milestones</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.CLIENT_PROJECTS)}>View All</Button>
            </div>
            <div className="space-y-3">
              {upcomingMilestones.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No upcoming milestones</p>
              ) : (
                upcomingMilestones.map((milestone) => (
                  <div key={`${milestone.projectId}-${milestone.id}`} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`${ROUTES.CLIENT_PROJECTS}/${milestone.projectId}`)}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: milestone.status === 'overdue' ? '#ef4444' : milestone.status === 'pending' ? '#f59e0b' : '#22c55e' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{milestone.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{milestone.projectName}</p>
                      <p className="text-xs text-slate-400 mt-1">Due {new Date(milestone.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      {activity.type === 'milestone' && <Calendar className="w-4 h-4" />}
                      {activity.type === 'update' && <TrendingUp className="w-4 h-4" />}
                      {activity.type === 'comment' && <Users className="w-4 h-4" />}
                      {activity.type === 'status_change' && <ArrowRight className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{activity.author}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{new Date(activity.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Pending Invoices</h3>
              <div className="space-y-3">
                {pendingInvoices.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No pending invoices</p>
                ) : (
                  pendingInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`${ROUTES.CLIENT_INVOICES}/${invoice.id}`)}>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{invoice.projectName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">${invoice.total.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Due {new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {pendingInvoices.length > 0 && (
                <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => navigate(ROUTES.CLIENT_INVOICES)}>View All Invoices</Button>
              )}
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
                {unreadNotifications.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">{unreadNotifications.length} new</span>
                )}
              </div>
              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No notifications</p>
                ) : (
                  notifications.slice(0, 4).map((notif) => (
                    <div key={notif.id} className={`flex items-start gap-2 p-2.5 rounded-xl transition-colors cursor-pointer ${notif.read ? 'bg-slate-50/30' : 'bg-blue-50/50 border border-blue-100/50'}`} onClick={() => { if (notif.link) navigate(notif.link); }}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.read ? 'bg-slate-300' : 'bg-blue-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{notif.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => navigate(ROUTES.CLIENT_NOTIFICATIONS)}>View All Notifications</Button>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Support Tickets</h3>
            <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.CLIENT_SUPPORT_CREATE)} icon={<Plus className="w-4 h-4" />}>
              New Ticket
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100/50">
              <p className="text-2xl font-bold text-red-700">{mockTickets.filter((t: any) => t.status === 'open').length}</p>
              <p className="text-xs text-red-600 mt-1">Open Tickets</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
              <p className="text-2xl font-bold text-blue-700">{mockTickets.filter((t: any) => t.status === 'in_progress').length}</p>
              <p className="text-xs text-blue-600 mt-1">In Progress</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50/50 border border-green-100/50">
              <p className="text-2xl font-bold text-green-700">{mockTickets.filter((t: any) => t.status === 'resolved').length}</p>
              <p className="text-xs text-green-600 mt-1">Resolved</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
