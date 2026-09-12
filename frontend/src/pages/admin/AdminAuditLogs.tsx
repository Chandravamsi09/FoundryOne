import React, { useState, useEffect } from 'react';
import { AdminAuditLog, PaginatedResponse } from '../../types/admin';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminAuditLogs() {
  const [data, setData] = useState<PaginatedResponse<AdminAuditLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const mockLogs: AdminAuditLog[] = [
        { id: '1', action: 'User Created', actor: 'admin@foundryone.com', target: 'new_employee@foundryone.com', timestamp: '2025-02-14T10:00:00Z', details: { role: 'employee' } },
        { id: '2', action: 'Project Updated', actor: 'sarah@foundryone.com', target: 'Project Alpha', timestamp: '2025-02-14T11:30:00Z', details: { status: 'in_progress' } },
        { id: '3', action: 'Organization Deleted', actor: 'admin@foundryone.com', target: 'Test Corp', timestamp: '2025-02-13T09:15:00Z', details: {} },
        { id: '4', action: 'Login Failed', actor: 'unknown', target: 'admin@foundryone.com', timestamp: '2025-02-13T08:00:00Z', details: { ip: '192.168.1.1' } },
        { id: '5', action: 'Settings Changed', actor: 'admin@foundryone.com', target: 'System Settings', timestamp: '2025-02-12T15:45:00Z', details: { setting: 'Email Provider' } },
      ];
      setData({ data: mockLogs, total: 154, page: 1, limit: 10, totalPages: 16 } as any);
    } catch (e) {
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, actionFilter, actorFilter]);

  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout title="Audit Logs">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Audit Logs</h2>
        <p className="text-sm text-slate-500 mt-1">Track administrative actions and system events</p>
      </div>

      <ErrorMessage message={error} />

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm mb-6">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <FormInput name="actor-filter" placeholder="Filter by actor..." value={actorFilter} onChange={(e) => setActorFilter(e.target.value)} />
          </div>
          <div className="flex-1">
            <FormInput name="action-filter" placeholder="Filter by action..." value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} />
          </div>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="animate-spin text-blue-600 h-8 w-8" /></div>
        ) : !data?.data.length ? (
          <div className="p-12 text-center text-slate-500">No audit logs found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Actor</th>
                    <th className="px-4 py-3 font-medium">Target</th>
                    <th className="px-4 py-3 font-medium">Details</th>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{log.action}</td>
                      <td className="px-4 py-3 text-slate-600">{log.actor}</td>
                      <td className="px-4 py-3 text-slate-600">{log.target}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{log.details}</td>
                      <td className="px-4 py-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
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
    </AdminLayout>
  );
}
