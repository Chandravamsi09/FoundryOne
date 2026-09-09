import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import clientService, { ClientProject, ClientMilestone, ClientTeamMember, ClientActivity, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../../services/clientService';
import { ROUTES } from '../../../types/constants';
import { ArrowLeft, Calendar, Users, DollarSign, Clock, CheckCircle, AlertTriangle, FileText, MessageSquare } from 'lucide-react';

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

type Tab = 'overview' | 'milestones' | 'team' | 'activity';

export default function ClientProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<ClientProject | null>(null);
  const [milestones, setMilestones] = useState<ClientMilestone[]>([]);
  const [team, setTeam] = useState<ClientTeamMember[]>([]);
  const [activity, setActivity] = useState<ClientActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    if (id) loadProjectDetails();
  }, [id]);

  const loadProjectDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      const clientId = (user as any)?.id || 'client_demo_001';
      const [projectData, milestonesData, teamData, activityData] = await Promise.all([
        clientService.getProject(clientId, id),
        clientService.getProjectMilestones(clientId, id),
        clientService.getProjectTeam(clientId, id),
        clientService.getProjectActivity(clientId, id),
      ]);
      setProject(projectData);
      setMilestones(milestonesData);
      setTeam(teamData);
      setActivity(activityData);
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Project Details" navItems={navItems} role="client">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-slate-500">Loading project details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout title="Project Details" navItems={navItems} role="client">
        <div className="text-center py-20">
          <p className="text-sm text-slate-500 mb-4">Project not found or you do not have access.</p>
          <Button variant="primary" onClick={() => navigate(ROUTES.CLIENT_PROJECTS)}>Back to Projects</Button>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: FileText },
    { id: 'milestones' as Tab, label: 'Milestones', icon: CheckCircle },
    { id: 'team' as Tab, label: 'Team', icon: Users },
    { id: 'activity' as Tab, label: 'Activity', icon: MessageSquare },
  ];

  return (
    <DashboardLayout title="Project Details" navItems={navItems} role="client">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <button onClick={() => navigate(ROUTES.CLIENT_PROJECTS)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>
                  {PROJECT_STATUS_LABELS[project.status]}
                </span>
              </div>
              <p className="text-sm text-slate-500">{project.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500 mb-1">Progress</p>
              <p className="text-lg font-bold text-slate-900">{project.progress}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500 mb-1">Budget</p>
              <p className="text-lg font-bold text-slate-900">${project.budget.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500 mb-1">Start Date</p>
              <p className="text-lg font-bold text-slate-900">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500 mb-1">End Date</p>
              <p className="text-lg font-bold text-slate-900">{new Date(project.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-200/60">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Project Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Manager</span>
                  <span className="text-sm font-medium text-slate-900">{project.managerName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>{PROJECT_STATUS_LABELS[project.status]}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Budget</span>
                  <span className="text-sm font-medium text-slate-900">${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Spent</span>
                  <span className="text-sm font-medium text-slate-900">${project.spent.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">Remaining</span>
                  <span className="text-sm font-medium text-slate-900">${(project.budget - project.spent).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">Overall Progress</span>
                    <span className="font-semibold text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="p-3 rounded-xl bg-blue-50/50">
                    <p className="text-xs text-blue-600 mb-1">Total Milestones</p>
                    <p className="text-xl font-bold text-blue-900">{milestones.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50/50">
                    <p className="text-xs text-green-600 mb-1">Completed</p>
                    <p className="text-xl font-bold text-green-900">{milestones.filter((m) => m.status === 'completed').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Milestones</h3>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="mt-0.5">
                    {milestone.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> : milestone.status === 'overdue' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{milestone.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{milestone.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">Due {new Date(milestone.dueDate).toLocaleDateString()}</span>
                      {milestone.completedAt && <span className="text-xs text-green-600">Completed {new Date(milestone.completedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Project Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                    <p className="text-xs text-slate-400">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    {act.type === 'milestone' && <CheckCircle className="w-4 h-4" />}
                    {act.type === 'update' && <Clock className="w-4 h-4" />}
                    {act.type === 'comment' && <MessageSquare className="w-4 h-4" />}
                    {act.type === 'status_change' && <ArrowLeft className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{act.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{act.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{act.author} • {new Date(act.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
