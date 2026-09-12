import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';
import { Project } from '../../types/manager';

const navItems = [
  { path: ROUTES.MANAGER_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MANAGER_TEAM, label: 'My Team', icon: '👥' },
  { path: ROUTES.MANAGER_PROJECTS, label: 'Projects', icon: '🚀' },
  { path: ROUTES.MANAGER_TASKS, label: 'Tasks', icon: '✅' },
  { path: ROUTES.MANAGER_APPROVALS, label: 'Approvals', icon: '📋' },
  { path: ROUTES.MANAGER_REPORTS, label: 'Reports', icon: '📈' },
  { path: ROUTES.MANAGER_ANALYTICS, label: 'Analytics', icon: '📊' },
];

const statusColors: Record<string, string> = {
  planning: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  on_track: 'bg-green-100 text-green-700',
  at_risk: 'bg-orange-100 text-orange-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadProjects = () => {
    let mounted = true;
    setLoading(true);
    managerService
      .getProjects()
      .then((data) => {
        if (mounted) setProjects(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load projects');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanup = loadProjects();
    return cleanup;
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.description.toLowerCase().includes(filter.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(filter.toLowerCase()));
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout title="Projects" navItems={navItems}>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const activeCount = projects.filter((p) => p.status === 'in_progress' || p.status === 'on_track').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const atRiskCount = projects.filter((p) => p.status === 'at_risk').length;

  return (
    <DashboardLayout title="Projects" navItems={navItems}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Portfolio</h2>
          <p className="text-sm text-slate-500 mt-1">Manage, monitor, and deliver your client and internal projects.</p>
        </div>
        <Button onClick={() => navigate(ROUTES.MANAGER_PROJECTS_CREATE)}>+ New Project</Button>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Total Projects</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{projects.length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completedCount}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">At Risk</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{atRiskCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search projects by name, description, client..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="on_track">On Track</option>
          <option value="at_risk">At Risk</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`${ROUTES.MANAGER_PROJECTS}/${project.id}`)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-slate-900">{project.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{project.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs font-medium">{project.client}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[project.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        project.priority === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : project.priority === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : project.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-600 w-8">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700">
                    {new Date(project.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700">
                    {project.assignedEmployees ? project.assignedEmployees.length : 0} members
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No projects found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
