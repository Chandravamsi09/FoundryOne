import React, { useState, useEffect } from 'react';
import { ROLES } from '../../types/constants';
import { AdminUser, PaginatedResponse } from '../../types/admin';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminUsers() {
  const [data, setData] = useState<PaginatedResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'employee' as AdminUser['role'], status: 'active' as AdminUser['status'], phone: '', organization: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getUsers({ page, limit: 10, search, role: roleFilter || undefined, status: statusFilter || undefined });
      setData(res);
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, roleFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'employee', status: 'active', phone: '', organization: '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status, phone: user.phone || '', organization: user.organization || '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, formData);
      } else {
        await adminService.createUser(formData);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setError('Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (e) {
      setError('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await adminService.toggleUserStatus(user.id);
      load();
    } catch (e) {
      setError('Failed to update status');
    }
  };

  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout title="User Management">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500 mt-1">Manage system users and permissions</p>
        </div>
        <Button onClick={openCreate}>Create User</Button>
      </div>

      <ErrorMessage message={error} />

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm mb-6">
        <form onSubmit={handleSearch} className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <FormInput name="search" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            {Object.entries(ROLES).map(([key, value]) => (
              <option key={key} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="animate-spin text-blue-600 h-8 w-8" /></div>
        ) : !data?.data.length ? (
          <div className="p-12 text-center text-slate-500">No users found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 capitalize text-slate-600">{user.role}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => openEdit(user)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                        <button onClick={() => handleToggleStatus(user)} className="text-slate-600 hover:text-slate-800 text-xs font-medium">
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => setDeleteTarget(user)} className="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
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
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{editingUser ? 'Edit User' : 'Create User'}</h3>
            <div className="space-y-4">
              <FormInput name="name" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} required />
              <FormInput name="email" label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={formErrors.email} required />
              <div>
                <label className="text-sm font-medium text-slate-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminUser['role'] })}
                  className="mt-1.5 w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(ROLES).map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminUser['status'] })}
                  className="mt-1.5 w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <FormInput name="phone" label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <FormInput name="organization" label="Organization" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} />
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>{editingUser ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
