import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import { Project, ProjectActivity, ProjectTaskSummary } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

export default function EmployeeProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await employeeService.getProject(id);
        if (!data) {
          setError('Project not found');
          return;
        }
        setProject(data);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Project Details" navItems={navItems}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !project) {
    return (
      <DashboardLayout title="Project Details" navItems={navItems}>
        <ErrorMessage message={error} className="mb-6" />
        <Button onClick={() => navigate('/employee/projects')}>Back to Projects</Button>
      </DashboardLayout>
    );
  }

  if (!project) return null;

  return (
    <DashboardLayout title={project.name} navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/employee/projects')}>
          ← Back to Projects
        </Button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
        <p className="text-sm text-slate-600 mt-2">{project.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Start Date</p>
            <p className="text-sm font-medium text-slate-900">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">End Date</p>
            <p className="text-sm font-medium text-slate-900">{new Date(project.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Manager</p>
            <p className="text-sm font-medium text-slate-900">{project.managerName}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-500">Progress</span>
            <span className="font-medium text-slate-700">{project.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Project Tasks</h3>
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>{task.status.replace('_', ' ')}</span>
                </div>
              ))}
              {project.tasks.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No tasks yet</p>}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {project.recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700"><span className="font-medium">{act.userName}</span> {act.action}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(act.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {project.recentActivity.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No activity yet</p>}
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Team Members</h3>
          <div className="space-y-3">
            {project.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
