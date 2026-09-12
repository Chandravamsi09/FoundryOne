import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';
import { DashboardStats, TeamMember, Project, Approval, Notification } from '../../types/manager';

const navItems = [
  { path: ROUTES.MANAGER_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MANAGER_TEAM, label: 'My Team', icon: '👥' },
  { path: ROUTES.MANAGER_PROJECTS, label: 'Projects', icon: '🚀' },
  { path: ROUTES.MANAGER_TASKS, label: 'Tasks', icon: '✅' },
  { path: ROUTES.MANAGER_APPROVALS, label: 'Approvals', icon: '📋' },
  { path: ROUTES.MANAGER_REPORTS, label: 'Reports', icon: '📈' },
  { path: ROUTES.MANAGER_ANALYTICS, label: 'Analytics', icon: '📊' },
];

const StatCard = ({ title, value, color = 'blue' }: { title: string; value: string | number; color?: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };
  const emojis: Record<string, string> = {
    blue: '👥',
    green: '🚀',
    purple: '📋',
    orange: '✅',
    red: '🔴',
    yellow: '⏳',
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${colors[color] || colors.blue} flex items-center justify-center text-xl`}>
          {emojis[color] || '📊'}
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadData = () => {
    let mounted = true;
    setLoading(true);
    setError('');

    Promise.all([
      managerService.getDashboardStats(),
      managerService.getTeamMembers(),
      managerService.getProjects(),
      managerService.getApprovals(),
      managerService.getNotifications(),
    ])
      .then(([s, t, p, a, n]) => {
        if (!mounted) return;
        setStats(s);
        setTeam(t.slice(0, 4));
        setProjects(p.slice(0, 4));
        setApprovals(a.filter((ap) => ap.status === 'pending').slice(0, 3));
        setNotifications(n.slice(0, 5));
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load dashboard');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanup = loadData();
    return cleanup;
  }, []);

  const handleQuickApproval = async (approvalId: string, status: 'approved' | 'rejected') => {
    try {
      await managerService.updateApprovalStatus(approvalId, status);
      setApprovals((prev) => prev.filter((a) => a.id !== approvalId));
      if (stats) {
        setStats({ ...stats, pendingApprovals: Math.max(0, stats.pendingApprovals - 1) });
      }
    } catch {
      setError('Failed to process approval');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Manager Dashboard" navItems={navItems}>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manager Dashboard" navItems={navItems}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Here is your operational overview, team status, and active approvals.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(ROUTES.MANAGER_PROJECTS_CREATE)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
          >
            + New Project
          </button>
          <button
            onClick={() => navigate(ROUTES.MANAGER_TASKS)}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-colors"
          >
            Assign Task
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Team Members" value={stats?.teamSize || 0} color="blue" />
        <StatCard title="Active Projects" value={stats?.activeProjects || 0} color="green" />
        <StatCard title="Pending Tasks" value={stats?.pendingTasks || 0} color="orange" />
        <StatCard title="Pending Approvals" value={stats?.pendingApprovals || 0} color="purple" />
      </div>

      {/* Active Projects & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Section
            title="Active Projects"
            action={
              <button onClick={() => navigate(ROUTES.MANAGER_PROJECTS)} className="text-sm text-blue-600 font-medium hover:text-blue-700">
                View All →
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Progress</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`${ROUTES.MANAGER_PROJECTS}/${project.id}`)}
                    >
                      <td className="py-3 text-slate-900 font-medium">{project.name}</td>
                      <td className="py-3 text-slate-600">{project.client}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : project.status === 'in_progress' || project.status === 'on_track'
                              ? 'bg-blue-100 text-blue-700'
                              : project.status === 'at_risk'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500">
                        No active projects found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section
            title="Pending Approvals"
            action={
              <button onClick={() => navigate(ROUTES.MANAGER_APPROVALS)} className="text-sm text-blue-600 font-medium hover:text-blue-700">
                View All →
              </button>
            }
          >
            <div className="space-y-3">
              {approvals.map((approval) => (
                <div key={approval.id} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{approval.type}</span>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{approval.title}</p>
                      <p className="text-xs text-slate-500">From: {approval.requesterName}</p>
                    </div>
                    <span className="text-xs text-slate-400">{approval.date}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleQuickApproval(approval.id, 'approved')}
                      className="flex-1 py-1.5 px-3 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleQuickApproval(approval.id, 'rejected')}
                      className="flex-1 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {approvals.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-6">No pending approvals</p>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Team Overview & Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Section
          title="Team Overview"
          action={
            <button onClick={() => navigate(ROUTES.MANAGER_TEAM)} className="text-sm text-blue-600 font-medium hover:text-blue-700">
              Manage Team →
            </button>
          }
        >
          <div className="space-y-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`${ROUTES.MANAGER_TEAM}/${member.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-500">Workload</span>
                    <p className="text-xs font-bold text-slate-700">{member.workload}%</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : member.status === 'on_leave'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {member.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Notifications & Alerts"
          action={
            <button onClick={() => navigate(ROUTES.MANAGER_APPROVALS)} className="text-sm text-blue-600 font-medium hover:text-blue-700">
              View All →
            </button>
          }
        >
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No new notifications</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => notification.link && navigate(notification.link)}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                      notification.type === 'success'
                        ? 'bg-green-500'
                        : notification.type === 'warning'
                        ? 'bg-yellow-500'
                        : notification.type === 'error'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Recent Activity */}
      <div>
        <Section title="Recent Project Activity">
          <div className="space-y-3">
            {projects
              .flatMap((p) => p.activity.map((a) => ({ ...a, projectName: p.name })))
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
              .map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs flex-shrink-0">
                    {item.user.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{item.user}</span> {item.action}
                    </p>
                    {item.details && <p className="text-xs text-slate-500 mt-0.5">{item.details}</p>}
                    <p className="text-xs text-slate-400 mt-1">
                      {item.projectName} · {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}
