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
  const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600', red: 'bg-red-50 text-red-600', yellow: 'bg-yellow-50 text-yellow-600' };
  const emojis: Record<string, string> = { blue: '👥', green: '🚀', purple: '✅', orange: '⏳', red: '🔴', yellow: '📋' };
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

const Section = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  on_leave: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-red-100 text-red-700',
};

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
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
        setApprovals(a.filter(ap => ap.status === 'pending').slice(0, 3));
        setNotifications(n.filter(nt => !nt.read).slice(0, 5));
      })
      .catch((err) => { if (mounted) setError(err.message || 'Failed to load dashboard'); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-1">Here is your team and project overview</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Team Size" value={stats?.teamSize || 0} color="blue" />
        <StatCard title="Active Projects" value={stats?.activeProjects || 0} color="green" />
        <StatCard title="Pending Tasks" value={stats?.pendingTasks || 0} color="orange" />
        <StatCard title="Completed Tasks" value={stats?.completedTasks || 0} color="purple" />
        <StatCard title="Overdue Tasks" value={stats?.overdueTasks || 0} color="red" />
        <StatCard title="Pending Approvals" value={stats?.pendingApprovals || 0} color="yellow" />
        <StatCard title="Team Performance" value={`${stats?.teamPerformance || 0}%`} color="green" />
        <StatCard title="Project Progress" value={`${stats?.projectProgress || 0}%`} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Section title="Team Members">
            <div className="space-y-3">
              {team.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => navigate(`${ROUTES.MANAGER_TEAM}/${member.id}`)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role} · {member.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[member.status]}`}>{member.status.replace('_', ' ')}</span>
                    <span className="text-sm font-medium text-slate-700">{member.tasksPending} pending</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate(ROUTES.MANAGER_TEAM)} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">View all team members →</button>
          </Section>
        </div>

        <div>
          <Section title="Pending Approvals">
            {approvals.length === 0 ? (
              <p className="text-sm text-slate-500">No pending approvals</p>
            ) : (
              <div className="space-y-3">
                {approvals.map((approval) => (
                  <div key={approval.id} className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors" onClick={() => navigate(ROUTES.MANAGER_APPROVALS)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">{approval.type}</span>
                      <span className="text-xs text-slate-400">{new Date(approval.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{approval.title}</p>
                    <p className="text-xs text-slate-500 mt-1">by {approval.requesterName}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => navigate(ROUTES.MANAGER_APPROVALS)} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">View all approvals →</button>
          </Section>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Section title="Project Progress">
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="cursor-pointer" onClick={() => navigate(`${ROUTES.MANAGER_PROJECTS}/${project.id}`)}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-slate-900">{project.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      project.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>{project.priority}</span>
                    <span className="text-slate-500">{project.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate(ROUTES.MANAGER_PROJECTS)} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">View all projects →</button>
        </Section>

        <Section title="Notifications">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500">No new notifications</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => notification.link && navigate(notification.link)}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
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

      <div className="mt-6">
        <Section title="Recent Activity">
          <div className="space-y-3">
            {projects.flatMap(p => p.activity.map(a => ({ ...a, projectName: p.name }))).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs flex-shrink-0">
                  {item.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900"><span className="font-medium">{item.user}</span> {item.action}</p>
                  {item.details && <p className="text-xs text-slate-500 mt-0.5">{item.details}</p>}
                  <p className="text-xs text-slate-400 mt-1">{item.projectName} · {new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}
