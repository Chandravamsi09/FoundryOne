import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';

const navItems = [
  { path: ROUTES.MANAGER_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MANAGER_TEAM, label: 'My Team', icon: '👥' },
  { path: ROUTES.MANAGER_PROJECTS, label: 'Projects', icon: '🚀' },
  { path: ROUTES.MANAGER_TASKS, label: 'Tasks', icon: '✅' },
  { path: ROUTES.MANAGER_APPROVALS, label: 'Approvals', icon: '📋' },
  { path: ROUTES.MANAGER_REPORTS, label: 'Reports', icon: '📈' },
  { path: ROUTES.MANAGER_ANALYTICS, label: 'Analytics', icon: '📊' },
];

type AnalyticsView = 'productivity' | 'project' | 'task' | 'workload' | 'deadlines';

export default function Analytics() {
  const navigate = useNavigate();
  const [view, setView] = useState<AnalyticsView>('productivity');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productivity, setProductivity] = useState<any[]>([]);
  const [projectProgress, setProjectProgress] = useState<any[]>([]);
  const [taskCompletion, setTaskCompletion] = useState<any[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      managerService.getProductivityTrend(),
      managerService.getProjectProgress(),
      managerService.getTaskCompletionReport(),
      managerService.getEmployeeWorkloadReport(),
      managerService.getDeadlinePerformance(),
    ])
      .then(([p, pp, tc, w, d]) => {
        if (!mounted) return;
        setProductivity(p);
        setProjectProgress(pp);
        setTaskCompletion(tc);
        setWorkload(w);
        setDeadlines(d);
      })
      .catch((err) => { if (mounted) setError(err.message || 'Failed to load analytics'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const renderProductivity = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-blue-50">
          <p className="text-xs text-blue-600 uppercase tracking-wider">Avg Tasks/Week</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{Math.round(productivity.reduce((s, i) => s + i.tasksCompleted, 0) / productivity.length)}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-50">
          <p className="text-xs text-green-600 uppercase tracking-wider">Avg Hours/Week</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{Math.round(productivity.reduce((s, i) => s + i.hoursLogged, 0) / productivity.length)}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-50">
          <p className="text-xs text-purple-600 uppercase tracking-wider">Total Weeks</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{productivity.length}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-900">Weekly Trend</h4>
        {productivity.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
            <span className="text-sm text-slate-700">{item.week}</span>
            <div className="flex gap-4">
              <span className="text-sm text-slate-600">Tasks: <strong>{item.tasksCompleted}</strong></span>
              <span className="text-sm text-slate-600">Hours: <strong>{item.hoursLogged}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectProgress = () => (
    <div className="space-y-4">
      {projectProgress.map((item, i) => (
        <div key={i}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-slate-900">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status.replace('_', ' ')}</span>
              <span className="text-slate-500">{item.progress}%</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${item.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderTaskCompletion = () => (
    <div className="space-y-3">
      {taskCompletion.map((item, i) => (
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

  const renderWorkload = () => (
    <div className="space-y-3">
      {workload.map((item, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
          <div>
            <p className="text-sm font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">{item.department}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 bg-slate-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.workload}%` }} />
            </div>
            <span className="text-sm text-slate-700 w-8">{item.workload}%</span>
            <span className="text-sm text-slate-600">{item.pendingTasks} pending</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDeadlines = () => (
    <div className="space-y-3">
      {deadlines.map((item, i) => (
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

  return (
    <DashboardLayout title="Analytics" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor team productivity, project progress, and performance trends</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'productivity', label: 'Productivity', icon: '📈' },
          { value: 'project', label: 'Project Progress', icon: '🚀' },
          { value: 'task', label: 'Task Completion', icon: '✅' },
          { value: 'workload', label: 'Employee Workload', icon: '👥' },
          { value: 'deadlines', label: 'Deadline Performance', icon: '📅' },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setView(item.value as AnalyticsView)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              view === item.value ? 'bg-blue-600 text-white' : 'bg-white/70 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="mr-1" aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : (
          <>
            {view === 'productivity' && renderProductivity()}
            {view === 'project' && renderProjectProgress()}
            {view === 'task' && renderTaskCompletion()}
            {view === 'workload' && renderWorkload()}
            {view === 'deadlines' && renderDeadlines()}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
