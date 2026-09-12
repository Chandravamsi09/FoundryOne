import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
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
    setError('');

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
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load analytics data');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const renderProductivity = () => {
    const totalTasks = productivity.reduce((s, i) => s + i.tasksCompleted, 0);
    const totalHours = productivity.reduce((s, i) => s + i.hoursLogged, 0);
    const avgTasks = productivity.length ? Math.round(totalTasks / productivity.length) : 0;
    const avgHours = productivity.length ? Math.round(totalHours / productivity.length) : 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Avg Tasks / Week</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{avgTasks}</p>
          </div>
          <div className="p-4 rounded-xl bg-green-50 border border-green-100">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Avg Hours / Week</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{avgHours} hrs</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Total Output</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">{totalTasks} tasks</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Weekly Velocity</h4>
          {productivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
              <div>
                <span className="text-sm font-bold text-slate-900">{item.week}</span>
                <p className="text-xs text-slate-500 mt-0.5">Team Logged Hours: {item.hoursLogged} hrs</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                  {item.tasksCompleted} Tasks Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectProgress = () => (
    <div className="space-y-4">
      {projectProgress.map((item, i) => (
        <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between text-sm mb-2">
            <div>
              <span className="font-bold text-slate-900">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
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

  const renderTaskCompletion = () => (
    <div className="space-y-3">
      {taskCompletion.map((item, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
          <span className="text-sm font-bold text-slate-800">{item.date}</span>
          <div className="flex gap-6">
            <span className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-lg font-semibold">
              Completed: {item.completed}
            </span>
            <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-lg font-medium">
              Created: {item.created}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWorkload = () => (
    <div className="space-y-3">
      {workload.map((item, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
          <div>
            <p className="text-sm font-bold text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">{item.department}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  item.workload > 80 ? 'bg-red-500' : item.workload > 60 ? 'bg-orange-500' : 'bg-blue-600'
                }`}
                style={{ width: `${item.workload}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-800 w-12 text-right">{item.workload}%</span>
            <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              {item.pendingTasks} pending
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDeadlines = () => (
    <div className="space-y-3">
      {deadlines.map((item, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
          <div>
            <p className="text-sm font-bold text-slate-900">{item.project}</p>
            <p className="text-xs text-slate-500">Deadline: {new Date(item.deadline).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                item.onTrack ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {item.onTrack ? 'On Schedule' : 'Schedule Risk'}
            </span>
            <span className="text-xs text-slate-600 font-semibold">{item.daysRemaining} days remaining</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout title="Analytics" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Analytics & Insights</h2>
        <p className="text-sm text-slate-500 mt-1">Track productivity curves, team load distribution, and deadline trajectories.</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'productivity', label: 'Productivity Trend', icon: '📈' },
          { value: 'project', label: 'Project Progress', icon: '🚀' },
          { value: 'task', label: 'Task Throughput', icon: '✅' },
          { value: 'workload', label: 'Workload Balance', icon: '👥' },
          { value: 'deadlines', label: 'Deadline Performance', icon: '📅' },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setView(item.value as AnalyticsView)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              view === item.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="mr-1.5" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
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
