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
  on_hold: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', priority: 'medium', deadline: '', budget: '' });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    Promise.all([managerService.getProject(id), managerService.getTasks({ projectId: id }), managerService.getTeamMembers()])
      .then(([p, t, m]) => {
        if (!mounted) return;
        if (p) {
          setProject(p);
          setForm({ name: p.name, description: p.description, priority: p.priority, deadline: p.deadline, budget: p.budget?.toString() || '' });
        }
        setTasks(t);
        setMembers(m);
      })
      .catch((err) => { if (mounted) setError(err.message || 'Failed to load project'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      const updated = await managerService.updateProject(project.id, {
        name: form.name,
        description: form.description,
        priority: form.priority as any,
        deadline: form.deadline,
        budget: form.budget ? parseFloat(form.budget) : undefined,
      });
      if (updated) setProject(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Project Detail" navItems={navItems}>
        <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout title="Project Detail" navItems={navItems}>
        <div className="text-center py-20">
          <p className="text-slate-500">Project not found</p>
          <Button onClick={() => navigate(ROUTES.MANAGER_PROJECTS)} className="mt-4">Back to Projects</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Project Detail" navItems={navItems}>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(ROUTES.MANAGER_PROJECTS)} className="mb-4">← Back to projects</Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit Project'}</Button>
            <Button onClick={() => navigate(ROUTES.MANAGER_TASKS)}>View Tasks</Button>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
          <span className={`inline-block mt-2 text-sm px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>{project.status.replace('_', ' ')}</span>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Priority</p>
          <span className={`inline-block mt-2 text-sm px-2 py-0.5 rounded-full ${
            project.priority === 'critical' ? 'bg-red-100 text-red-700' :
            project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
          }`}>{project.priority}</span>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Progress</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{project.progress}%</p>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Deadline</p>
          <p className="text-lg font-semibold text-slate-900 mt-1">{new Date(project.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleUpdate} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-900">Edit Project</h3>
          <FormInput label="Project Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <FormInput label="Deadline" name="deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
            <FormInput label="Budget" name="budget" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" loading={loading}>Save Changes</Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Assigned Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {project.assignedEmployees.map((empId) => {
            const member = members.find(m => m.id === empId);
            if (!member) return null;
            return (
              <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors" onClick={() => navigate(`${ROUTES.MANAGER_TEAM}/${member.id}`)}>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Project Tasks</h3>
          <Button size="sm" onClick={() => navigate(ROUTES.MANAGER_TASKS)}>View All Tasks</Button>
        </div>
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors" onClick={() => navigate(`${ROUTES.MANAGER_TASKS}/${task.id}`)}>
              <div>
                <p className="text-sm font-medium text-slate-900">{task.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">Due {new Date(task.deadline).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                task.status === 'completed' ? 'bg-green-100 text-green-700' :
                task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                task.status === 'blocked' ? 'bg-red-100 text-red-700' :
                task.status === 'review' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
              }`}>{task.status.replace('_', ' ')}</span>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-sm text-slate-500">No tasks yet</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
