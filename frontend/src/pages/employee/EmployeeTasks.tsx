import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import TaskCard from '../../components/employee/TaskCard';
import StatusBadge from '../../components/employee/StatusBadge';
import PriorityBadge from '../../components/employee/PriorityBadge';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Task, TaskFilters, TaskStatus, TaskPriority } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

const priorityOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

export default function EmployeeTasks() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<TaskFilters>({
    search: searchParams.get('search') || '',
    status: (searchParams.get('status') as TaskStatus) || '',
    priority: (searchParams.get('priority') as TaskPriority) || '',
    sortBy: (searchParams.get('sortBy') as TaskFilters['sortBy']) || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    limit: 9,
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await employeeService.getTasks({ ...filters, page });
      setTasks(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, [page, filters.search, filters.status, filters.priority, filters.sortBy, filters.sortOrder]);

  const updateFilter = (key: keyof TaskFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await employeeService.updateTask(taskId, { status });
      loadTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  return (
    <DashboardLayout title="My Tasks" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Tasks</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track your tasks</p>
        </div>
        <Button size="sm" onClick={() => navigate('/employee/tasks')} variant="secondary">
          Refresh
        </Button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <FormInput
              label="Search"
              name="search"
              placeholder="Search tasks..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value)}
              className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {priorityOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-600">
        Showing {tasks.length} of {total} tasks
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => navigate(`/employee/tasks/${task.id}`)}
                onStatusChange={(status) => handleStatusChange(task.id, status)}
              />
            ))}
          </div>
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No tasks found matching your criteria</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
              <Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
