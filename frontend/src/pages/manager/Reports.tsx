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
  const [filters, setFilters] = useState<ReportFilters>({});
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
          setData(await managerService.getEmployeeWorkloadReport());
          break;
        case 'deadline-performance':
          setData(await managerService.getDeadlinePerformance());
          break;
        case 'project-progress':
          setData(await managerService.getProjectProgress());
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderReportContent = () => {
    if (!data) return <p className="text-sm text-slate-500">Select a report type to view data</p>;

    if (reportType === 'task-completion') {
      return (
        <div className="space-y-3">
          {data.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <span className="text-sm font-medium text-slate-700">{item.date}</span>
              <div className="flex gap-4">
                <span className="text-sm text-slate-600">Completed: <strong>{item.completed}</strong></span>
                <span className="text-sm text-slate-600">Created: <strong>{item.created}</strong></span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (reportType === 'employee-workload') {
      return (
        <div className="space-y-3">
          {data.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.department}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.workload}%` }} />
                </div>
                <span className="text-sm text-slate-700 w-16">{item.workload}%</span>
                <span className="text-sm text-slate-600">{item.pendingTasks} pending</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (reportType === 'deadline-performance') {
      return (
        <div className="space-y-3">
          {data.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.project}</p>
                <p className="text-xs text-slate-500">Deadline: {new Date(item.deadline).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.onTrack ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.onTrack ? 'On Track' : 'At Risk'}
                </span>
                <span className="text-sm text-slate-600">{item.daysRemaining} days left</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (reportType === 'project-progress') {
      return (
        <div className="space-y-4">
          {data.map((item: any, i: number) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-slate-900">{item.name}</span>
                <span className="text-slate-500">{item.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.progress}%` }} />
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
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500 mt-1">Generate and export team, project, and task reports</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Report Type</h3>
            {[
              { value: 'task-completion', label: 'Task Completion', icon: '✅' },
              { value: 'employee-workload', label: 'Employee Workload', icon: '👥' },
              { value: 'deadline-performance', label: 'Deadline Performance', icon: '📅' },
              { value: 'project-progress', label: 'Project Progress', icon: '🚀' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setReportType(item.value as ReportType)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  reportType === item.value ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm mt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Filters</h3>
            <div className="space-y-3">
              <FormInput label="From" name="dateFrom" type="date" value={filters.dateFrom || ''} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} />
              <FormInput label="To" name="dateTo" type="date" value={filters.dateTo || ''} onChange={(e) => handleFilterChange('dateTo', e.target.value)} />
              <Button onClick={fetchReport} loading={loading} className="w-full">Apply Filters</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 capitalize">{reportType.replace('-', ' ')} Report</h3>
              <Button variant="secondary" size="sm" onClick={() => alert('Export functionality would connect to backend API')}>Export CSV</Button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
            ) : (
              renderReportContent()
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
