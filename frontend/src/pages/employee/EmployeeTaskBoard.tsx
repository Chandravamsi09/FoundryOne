import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/Button';
import StatusBadge from '../../components/employee/StatusBadge';
import PriorityBadge from '../../components/employee/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import { Task, TaskStatus } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Pending', color: 'border-orange-200' },
  { status: 'in_progress', label: 'In Progress', color: 'border-blue-200' },
  { status: 'completed', label: 'Completed', color: 'border-green-200' },
  { status: 'on_hold', label: 'On Hold', color: 'border-gray-200' },
];

export default function EmployeeTaskBoard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await employeeService.getTasks({ limit: 50 });
        setTasks(result.data);
      } catch (err) {
        setError('Failed to load task board');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getTasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await employeeService.updateTask(taskId, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString().split('T')[0] } : t)));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Task Board" navItems={navItems}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Task Board" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Task Board</h2>
          <p className="text-sm text-slate-500 mt-1">Drag-free board view of your tasks</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => navigate('/employee/tasks')}>Switch to List</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col.status} className={`bg-slate-50/50 rounded-2xl border-2 ${col.color} p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">{col.label}</h3>
              <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full">{getTasksByStatus(col.status).length}</span>
            </div>
            <div className="space-y-3">
              {getTasksByStatus(col.status).map((task) => (
                <div key={task.id} onClick={() => navigate(`/employee/tasks/${task.id}`)} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="text-sm font-medium text-slate-900 mb-2">{task.title}</h4>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-xs text-slate-400">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  {task.status !== 'completed' && (
                    <select
                      value={task.status}
                      onChange={(e) => { e.stopPropagation(); handleStatusChange(task.id, e.target.value as TaskStatus); }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 w-full text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="in_progress">Move to In Progress</option>
                      <option value="completed">Move to Completed</option>
                      <option value="on_hold">Move to On Hold</option>
                      <option value="pending">Move to Pending</option>
                    </select>
                  )}
                </div>
              ))}
              {getTasksByStatus(col.status).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
