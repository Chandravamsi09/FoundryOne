import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';
import { Project, Task, TeamMember } from '../../types/manager';

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

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    client: '',
    status: 'in_progress',
    priority: 'medium',
    progress: 0,
    deadline: '',
    budget: '',
  });

  const loadProject = () => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError('');

    Promise.all([
      managerService.getProject(id),
      managerService.getTasks({ projectId: id }),
      managerService.getTeamMembers(),
    ])
      .then(([p, t, m]) => {
        if (!mounted) return;
        if (p) {
          setProject(p);
          setForm({
            name: p.name,
            description: p.description || '',
            client: p.client || '',
            status: p.status,
            priority: p.priority,
            progress: p.progress,
            deadline: p.deadline || '',
            budget: p.budget?.toString() || '',
          });
        }
        setTasks(t);
        setMembers(m);
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load project details');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanup = loadProject();
    return cleanup;
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setUpdating(true);
    setError('');
    try {
      const updated = await managerService.updateProject(project.id, {
        name: form.name,
        description: form.description,
        client: form.client,
        status: form.status as any,
        priority: form.priority as any,
        progress: Number(form.progress),
        deadline: form.deadline,
        budget: form.budget ? parseFloat(form.budget) : undefined,
      });
      if (updated) setProject(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!window.confirm(`Are you sure you want to delete project "${project.name}"?`)) return;
    try {
      await managerService.deleteProject(project.id);
      navigate(ROUTES.MANAGER_PROJECTS);
    } catch {
      setError('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Project Detail" navItems={navItems}>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout title="Project Detail" navItems={navItems}>
        <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200">
          <p className="text-slate-600 text-lg font-medium">Project not found</p>
          <Button onClick={() => navigate(ROUTES.MANAGER_PROJECTS)} className="mt-4">
            ← Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Projects / ${project.name}`} navItems={navItems}>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(ROUTES.MANAGER_PROJECTS)} className="mb-4">
          ← Back to Projects
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  statusColors[project.status] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Client: <span className="font-semibold text-slate-700">{project.client}</span> • Due{' '}
              {new Date(project.deadline).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel Edit' : 'Edit Project'}
            </Button>
            <Button onClick={() => navigate(ROUTES.MANAGER_TASKS)}>View Project Tasks</Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Priority</p>
          <span
            className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              project.priority === 'critical'
                ? 'bg-red-100 text-red-700'
                : project.priority === 'high'
                ? 'bg-orange-100 text-orange-700'
                : project.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {project.priority.toUpperCase()}
          </span>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Overall Progress</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{project.progress}%</p>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Budget</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {project.budget ? `$${project.budget.toLocaleString()}` : 'Not Specified'}
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Team Size</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {project.assignedEmployees ? project.assignedEmployees.length : 0} members
          </p>
        </div>
      </div>

      {/* Editing Form */}
      {editing && (
        <form onSubmit={handleUpdate} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6 space-y-5">
          <h3 className="text-lg font-bold text-slate-900">Edit Project Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Project Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <FormInput
              label="Client"
              name="client"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="on_track">On Track</option>
                <option value="at_risk">At Risk</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <FormInput
              label="Progress (%)"
              name="progress"
              type="number"
              min="0"
              max="100"
              value={form.progress.toString()}
              onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
            />

            <FormInput
              label="Deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
            />
          </div>

          <FormInput
            label="Budget (USD)"
            name="budget"
            type="number"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={updating}>
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Description */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6">
        <h3 className="text-base font-semibold text-slate-900 mb-2">Project Overview</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {project.description || 'No detailed description provided for this project.'}
        </p>
      </div>

      {/* Assigned Team */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Assigned Team Members</h3>
          <Button size="sm" variant="secondary" onClick={() => navigate(ROUTES.MANAGER_TEAM)}>
            Manage Team
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {project.assignedEmployees && project.assignedEmployees.map((empId) => {
            const member = members.find((m) => m.id === empId);
            if (!member) return null;
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white/60 cursor-pointer transition-colors"
                onClick={() => navigate(`${ROUTES.MANAGER_TEAM}/${member.id}`)}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Tasks */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Project Tasks ({tasks.length})</h3>
          <Button size="sm" onClick={() => navigate(ROUTES.MANAGER_TASKS)}>
            + Add Task
          </Button>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white/60 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{task.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned to: {task.assignedToName || 'Unassigned'} • Due{' '}
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : task.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-700'
                    : task.status === 'review'
                    ? 'bg-purple-100 text-purple-700'
                    : task.status === 'blocked'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {task.status.replace('_', ' ')}
              </span>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-slate-500 py-6 text-center">No tasks recorded for this project yet</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
