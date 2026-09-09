import React, { useState, useEffect } from 'react';
import { AdminOrganization, PaginatedResponse } from '../../types/admin';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminOrganizations() {
  const [data, setData] = useState<PaginatedResponse<AdminOrganization> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<AdminOrganization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminOrganization | null>(null);
  const [formData, setFormData] = useState({ name: '', industry: '', size: '1-10', status: 'active' as AdminOrganization['status'] });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const orgs = await adminService.getOrganizations();
      let filtered = orgs;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((o) => o.name.toLowerCase().includes(q) || o.industry.toLowerCase().includes(q));
      }
      const limit = 10;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);
      setData({ data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) });
    } catch (e) {
      setError('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const openCreate = () => {
    setEditingOrg(null);
    setFormData({ name: '', industry: '', size: '1-10', status: 'active' });
    setModalOpen(true);
  };

  const openEdit = (org: AdminOrganization) => {
    setEditingOrg(org);
    setFormData({ name: org.name, industry: org.industry, size: org.size, status: org.status });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingOrg) {
        await adminService.updateOrganization(editingOrg.id, formData);
      } else {
        await adminService.createOrganization(formData);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setError('Failed to save organization');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteOrganization(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (e) {
      setError('Failed to delete organization');
    }
  };

  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout title="Organizations">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Organizations</h2>
          <p className="text-sm text-slate-500 mt-1">Manage organizations and their members</p>
        </div>
        <Button onClick={openCreate}>Create Organization</Button>
      </div>

      <ErrorMessage message={error} />

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm mb-6">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} className="p-4 flex gap-3">
          <div className="flex-1">
            <FormInput name="org-search" placeholder="Search organizations..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="animate-spin text-blue-600 h-8 w-8" /></div>
        ) : !data?.data.length ? (
          <div className="p-12 text-center text-slate-500">No organizations found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Industry</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                    <th className="px-4 py-3 font-medium">Members</th>
                    <th className="px-4 py-3 font-medium">Projects</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{org.name}</td>
                      <td className="px-4 py-3 text-slate-600">{org.industry}</td>
                      <td className="px-4 py-3 text-slate-600">{org.size}</td>
                      <td className="px-4 py-3 text-slate-600">{org.memberCount}</td>
                      <td className="px-4 py-3 text-slate-600">{org.projectCount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => openEdit(org)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                        <button onClick={() => setDeleteTarget(org)} className="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="p-4 flex items-center justify-between border-t border-slate-100">
                <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                  <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Organization"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{editingOrg ? 'Edit Organization' : 'Create Organization'}</h3>
            <div className="space-y-4">
              <FormInput name="org-name" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <FormInput name="org-industry" label="Industry" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} required />
              <div>
                <label className="text-sm font-medium text-slate-700">Size</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminOrganization['status'] })}
                  className="mt-1.5 w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>{editingOrg ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
