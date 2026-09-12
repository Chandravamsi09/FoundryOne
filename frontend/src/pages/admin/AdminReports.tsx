import React, { useState, useEffect } from 'react';
import { ReportFilter } from '../../types/admin';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminReports() {
  const [reportType, setReportType] = useState<ReportFilter['type']>('users');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const mockReports = {
        users: [
          { id: 1, title: 'Weekly User Growth', value: '+15%', trend: 'up', description: 'New users registered this week' },
          { id: 2, title: 'Active Sessions', value: '1,245', trend: 'up', description: 'Average daily active users' }
        ],
        projects: [
          { id: 1, title: 'Projects Completed', value: '24', trend: 'up', description: 'Projects finished this month' },
          { id: 2, title: 'Delayed Projects', value: '3', trend: 'down', description: 'Projects behind schedule' }
        ],
        organizations: [
          { id: 1, title: 'New Organizations', value: '4', trend: 'up', description: 'Orgs onboarded this month' }
        ],
        activity: [
          { id: 1, title: 'Total API Calls', value: '45K', trend: 'up', description: 'System API requests' },
          { id: 2, title: 'Error Rate', value: '0.01%', trend: 'down', description: 'Overall system error rate' }
        ]
      };
      
      setReports((mockReports as any)[reportType] || []);
    } catch (e) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [reportType]);

  const reportTitles: Record<string, string> = {
    users: 'User Reports',
    projects: 'Project Reports',
    organizations: 'Organization Reports',
    activity: 'Activity Reports',
  };

  return (
    <AdminLayout title="Reports">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500 mt-1">Generate and export system reports</p>
      </div>

      <ErrorMessage message={error} />

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportFilter['type'])}
              className="px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="users">Users</option>
              <option value="projects">Projects</option>
              <option value="organizations">Organizations</option>
              <option value="activity">Activity</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">From</label>
            <input
              name="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">To</label>
            <input
              name="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button onClick={load} loading={loading}>Generate</Button>
          <Button variant="secondary" onClick={() => alert('Export functionality would download CSV/PDF here.')}>Export</Button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">{reportTitles[reportType]}</h3>
        {loading ? (
          <div className="p-12 flex justify-center"><div className="animate-spin text-blue-600 h-8 w-8" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reports.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{item.value}</p>
                <p className="text-xs text-slate-500 mt-1">{item.change} from last period</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
