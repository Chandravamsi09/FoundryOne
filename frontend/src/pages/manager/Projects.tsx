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
  on_hold: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    managerService.getProjects()
      .then((data) => { if (mounted) setProjects(data); })
      .catch((err) => { if (mounted) setError(err.message || 'Failed to load projects'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = projects.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.status.includes(filter.toLowerCase()));

  if (loading) {
    return (
      <DashboardLayout title="Projects" navItems={navItems}>
        <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Projects" navItems={navItems}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track all projects</p>
        </div>
        <Button onClick={() => navigate(ROUTES.MANAGER_PROJECTS_CREATE)}>+ New Project</Button>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 font-medium text-slate-500">Project</th>
                <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 font-medium text-slate-500">Priority</th>
                <th className="px-4 py-3 font-medium text-slate-500">Progress</th>
                <th className="px-4 py-3 font-medium text-slate-500">Deadline</th>
                <th className="px-4 py-3 font-medium text-slate-500">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => navigate(`${ROUTES.MANAGER_PROJECTS}/${project.id}`)}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{project.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{project.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>{project.status.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      project.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>{project.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-600 w-8">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{new Date(project.deadline).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-700">{project.assignedEmployees.length} members</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
