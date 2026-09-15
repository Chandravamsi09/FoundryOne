import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';
import { validateRequired } from '../../utils/validation';

const navItems = [
  { path: ROUTES.MANAGER_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MANAGER_TEAM, label: 'My Team', icon: '👥' },
  { path: ROUTES.MANAGER_PROJECTS, label: 'Projects', icon: '🚀' },
  { path: ROUTES.MANAGER_TASKS, label: 'Tasks', icon: '✅' },
  { path: ROUTES.MANAGER_APPROVALS, label: 'Approvals', icon: '📋' },
  { path: ROUTES.MANAGER_REPORTS, label: 'Reports', icon: '📈' },
  { path: ROUTES.MANAGER_ANALYTICS, label: 'Analytics', icon: '📊' },
];

export default function CreateProject() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', priority: 'medium', deadline: '', budget: '' });
  const [assigned, setAssigned] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    managerService.getTeamMembers().then(members => setTeam(members.map(m => ({ id: m.id, name: m.name }))));
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    newErrors.name = validateRequired(form.name, 'Project name');
    newErrors.deadline = validateRequired(form.deadline, 'Deadline');
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const project = await managerService.createProject({
        name: form.name,
        description: form.description,
        priority: form.priority as 'low' | 'medium' | 'high' | 'critical',
        deadline: form.deadline,
        assignedEmployees: assigned,
        budget: form.budget ? parseFloat(form.budget) : undefined,
        managerId: 'mgr_1',
      });
      navigate(`${ROUTES.MANAGER_PROJECTS}/${project.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Project" navItems={navItems}>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
          <p className="text-sm text-slate-500 mt-1">Set up a new project and assign team members</p>
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm space-y-5">
          <FormInput label="Project Name" name="name" placeholder="Enter project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              placeholder="Describe the project goals and scope..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <FormInput label="Deadline" name="deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} error={errors.deadline} required />
          </div>
          <FormInput label="Budget (optional)" name="budget" type="number" placeholder="0.00" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Assign Team Members</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {team.map((member) => (
                <label key={member.id} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
                  <input type="checkbox" checked={assigned.includes(member.id)} onChange={(e) => setAssigned(e.target.checked ? [...assigned, member.id] : assigned.filter(id => id !== member.id))} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700 truncate">{member.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">Create Project</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.MANAGER_PROJECTS)}>Cancel</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
