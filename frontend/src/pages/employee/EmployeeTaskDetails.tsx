import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/employee/StatusBadge';
import PriorityBadge from '../../components/employee/PriorityBadge';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import { Task, TaskComment, TaskHistory } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

export default function EmployeeTaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [task, setTask] = useState<Task | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await employeeService.getTask(id);
        if (!data) {
          setError('Task not found');
          return;
        }
        setTask(data);
      } catch (err) {
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !task) return;
    try {
      setSubmitting(true);
      await employeeService.addTaskComment(task.id, comment.trim(), 'Employee');
      setComment('');
      const updated = await employeeService.getTask(task.id);
      if (updated) setTask(updated);
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;
    try {
      await employeeService.updateTask(task.id, { status: newStatus });
      const updated = await employeeService.getTask(task.id);
      if (updated) setTask(updated);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Task Details" navItems={navItems}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !task) {
    return (
      <DashboardLayout title="Task Details" navItems={navItems}>
        <ErrorMessage message={error} className="mb-6" />
        <Button onClick={() => navigate('/employee/tasks')}>Back to Tasks</Button>
      </DashboardLayout>
    );
  }

  if (!task) return null;

  const statusActions: { label: string; value: Task['status'] }[] = [
    { label: 'Start', value: 'in_progress' },
    { label: 'Complete', value: 'completed' },
    { label: 'Hold', value: 'on_hold' },
    { label: 'Reopen', value: 'pending' },
  ];

  return (
    <DashboardLayout title="Task Details" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/employee/tasks')}>
          ← Back to Tasks
        </Button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{task.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{task.projectName}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
        <p className="text-sm text-slate-700 mt-4">{task.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Due Date</p>
            <p className="text-sm font-medium text-slate-900">{new Date(task.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Created</p>
            <p className="text-sm font-medium text-slate-900">{new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Last Updated</p>
            <p className="text-sm font-medium text-slate-900">{new Date(task.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        {task.status !== 'completed' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Update Status</label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className="px-4 py-2 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusActions.map((action) => (
                <option key={action.value} value={action.value}>{action.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Comments</h3>
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex gap-2">
              <FormInput
                label=""
                name="comment"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" loading={submitting} className="self-end">Add</Button>
            </div>
          </form>
          <div className="space-y-3">
            {task.comments.map((cmt) => (
              <div key={cmt.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{cmt.userName}</span>
                  <span className="text-xs text-slate-400">{new Date(cmt.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-700 mt-1">{cmt.text}</p>
              </div>
            ))}
            {task.comments.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No comments yet</p>}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">History</h3>
          <div className="space-y-3">
            {task.history.map((hist) => (
              <div key={hist.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">{hist.userName}</span> changed status from <span className="font-medium">{hist.oldValue?.replace('_', ' ')}</span> to <span className="font-medium">{hist.newValue?.replace('_', ' ')}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(hist.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {task.history.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No history yet</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
