import React, { useState, useEffect } from 'react';
import { AdminProject } from '../../types/admin';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'planning' as AdminProject['status'], progress: 0, owner: '', team: '' as string, deadline: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getProjects({ status: statusFilter || undefined, search });
      setProjects(res);
    } catch (e) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const openCreate = () => {
    setSelectedProject(null);
    setFormData({ name: '', description: '', status: 'planning', progress: 0, owner: '', team: '', deadline: '' });
    setModalOpen(true);
  };

  const openEdit = (project: AdminProject) => {
    setSelectedProject(project);
    setFormData({ name: project.name, description: project.description, status: project.status, progress: project.progress, owner: project.owner, team: project.team.join(', '), deadline: project.deadline });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (selectedProject) {
        await adminService.updateProject(selectedProject.id, { ...formData, team: formData.team.split(',').map((s) => s.trim()).filter(Boolean) });
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setError('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.updateProject(deleteTarget.id, { name: deleteTarget.name });
      setDeleteTarget(null);
      load();
    } catch (e) {
      setError('Failed to delete project');
    }
  };

  const statusColors: Record<string, string> = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    planning: 'bg-yellow-100 text-yellow-800',
    on_hold: 'bg-red-100 text-red-800',
  };

  return (
    <AdminLayout title="Projects">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-sm text-slate-500 mt-1">Monitor and manage all projects</p>
        </div>
        <Button onClick={openCreate}>Create Project</Button>
      </div>

      <ErrorMessage message={error} />

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm mb-6">
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <FormInput name="project-search" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="animate-spin text-blue-600 h-8 w-8" /></div>
        ) : !projects.length ? (
          <div className="p-12 text-center text-slate-500">No projects found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Deadline</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{project.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{project.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{project.owner}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 mt-1">{project.progress}%</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(project.deadline).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(project)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                      <button onClick={() => setDeleteTarget(project)} className="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{selectedProject ? 'Edit Project' : 'Create Project'}</h3>
            <div className="space-y-4">
              <FormInput name="project-name" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <FormInput name="project-desc" label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminProject['status'] })}
                  className="mt-1.5 w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Progress (%)</label>
                <input
                  name="progress"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                  className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <FormInput name="owner" label="Owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
              <FormInput name="team" label="Team (comma separated)" value={formData.team} onChange={(e) => setFormData({ ...formData, team: e.target.value })} />
              <FormInput name="deadline" label="Deadline" type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>{selectedProject ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
