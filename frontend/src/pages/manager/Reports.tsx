import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';
import { ReportFilters } from '../../types/manager';

const navItems = [
  { path: ROUTES.MANAGER_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MANAGER_TEAM, label: 'My Team', icon: '👥' },
  { path: ROUTES.MANAGER_PROJECTS, label: 'Projects', icon: '🚀' },
  { path: ROUTES.MANAGER_TASKS, label: 'Tasks', icon: '✅' },
  { path: ROUTES.MANAGER_APPROVALS, label: 'Approvals', icon: '📋' },
  { path: ROUTES.MANAGER_REPORTS, label: 'Reports', icon: '📈' },
  { path: ROUTES.MANAGER_ANALYTICS, label: 'Analytics', icon: '📊' },
];

type ReportType = 'task-completion' | 'employee-workload' | 'deadline-performance' | 'project-progress';

export default function Reports() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<ReportType>('task-completion');
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: '',
    dateTo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      switch (reportType) {
        case 'task-completion':
          setData(await managerService.getTaskCompletionReport(filters));
          break;
        case 'employee-workload':
          setData(await managerService.getEmployeeWorkloadReport(filters));
          break;
        case 'deadline-performance':
          setData(await managerService.getDeadlinePerformance(filters));
          break;
        case 'project-progress':
          setData(await managerService.getProjectProgress(filters));
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      alert('No data available to export');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((item) =>
      Object.values(item)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foundryone_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    setFilters({ dateFrom: '', dateTo: '' });
    setTimeout(() => {
      fetchReportWithFilters({ dateFrom: '', dateTo: '' });
    }, 0);
  };

  const fetchReportWithFilters = async (activeFilters: ReportFilters) => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      switch (reportType) {
        case 'task-completion':
          setData(await managerService.getTaskCompletionReport(activeFilters));
          break;
        case 'employee-workload':
          setData(await managerService.getEmployeeWorkloadReport(activeFilters));
          break;
        case 'deadline-performance':
          setData(await managerService.getDeadlinePerformance(activeFilters));
          break;
        case 'project-progress':
          setData(await managerService.getProjectProgress(activeFilters));
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const renderReportContent = () => {
    if (!data) return <p className="text-sm text-slate-500 py-8 text-center">No report data generated.</p>;

    if (Array.isArray(data) && data.length === 0) {
      return (
        <div className="py-12 text-center text-slate-500">
          <p className="text-base font-medium text-slate-700">No records found for the selected date range.</p>
          <p className="text-xs text-slate-400 mt-1">Try expanding or clearing the date filter.</p>
        </div>
      );
    }

    if (reportType === 'task-completion') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="pb-3 font-medium">Period / Day</th>
                <th className="pb-3 font-medium">Tasks Completed</th>
                <th className="pb-3 font-medium">Tasks Created</th>
                <th className="pb-3 font-medium">Completion Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item: any, i: number) => {
                const ratio = item.created > 0 ? Math.round((item.completed / item.created) * 100) : 100;
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 font-semibold text-slate-900">{item.date}</td>
                    <td className="py-3 text-green-600 font-bold">{item.completed}</td>
                    <td className="py-3 text-slate-700">{item.created}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {ratio}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportType === 'employee-workload') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="pb-3 font-medium">Team Member</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Workload %</th>
                <th className="pb-3 font-medium">Pending Tasks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3 text-slate-600 text-xs">{item.department}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.workload > 80 ? 'bg-red-500' : item.workload > 60 ? 'bg-orange-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${item.workload}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{item.workload}%</span>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-slate-800">{item.pendingTasks} tasks</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportType === 'deadline-performance') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Target Deadline</th>
                <th className="pb-3 font-medium">Schedule Status</th>
                <th className="pb-3 font-medium">Days Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 font-semibold text-slate-900">{item.project}</td>
                  <td className="py-3 text-slate-600">{new Date(item.deadline).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        item.onTrack ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.onTrack ? 'On Schedule' : 'Deadline Risk'}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-slate-700 font-medium">{item.daysRemaining} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportType === 'project-progress') {
      return (
        <div className="space-y-4">
          {data.map((item: any, i: number) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold text-slate-900">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                    {item.status}
                  </span>
                  <span className="font-bold text-slate-800">{item.progress}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <DashboardLayout title="Reports" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Managerial Reports</h2>
        <p className="text-sm text-slate-500 mt-1">Generate, filter, and export performance and completion datasets.</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Report Selector</h3>
            {[
              { value: 'task-completion', label: 'Task Completion', icon: '✅' },
              { value: 'employee-workload', label: 'Employee Workload', icon: '👥' },
              { value: 'deadline-performance', label: 'Deadline Performance', icon: '📅' },
              { value: 'project-progress', label: 'Project Progress', icon: '🚀' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setReportType(item.value as ReportType)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  reportType === item.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Date Filter</h3>
            <div className="space-y-3">
              <FormInput
                label="From"
                name="dateFrom"
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
              <FormInput
                label="To"
                name="dateTo"
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={fetchReport} loading={loading} className="flex-1">
                  Apply Filters
                </Button>
                {(filters.dateFrom || filters.dateTo) && (
                  <Button variant="secondary" onClick={handleClearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 capitalize">
                  {reportType.replace('-', ' ')} Summary
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Live aggregated dataset</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleExportCSV}>
                📥 Export CSV
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              renderReportContent()
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
