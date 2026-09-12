import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';
import { TeamMember, Task, Project } from '../../types/manager';

const navItems = [
  { path: ROUTES.MANAGER_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MANAGER_TEAM, label: 'My Team', icon: '👥' },
  { path: ROUTES.MANAGER_PROJECTS, label: 'Projects', icon: '🚀' },
  { path: ROUTES.MANAGER_TASKS, label: 'Tasks', icon: '✅' },
  { path: ROUTES.MANAGER_APPROVALS, label: 'Approvals', icon: '📋' },
  { path: ROUTES.MANAGER_REPORTS, label: 'Reports', icon: '📈' },
  { path: ROUTES.MANAGER_ANALYTICS, label: 'Analytics', icon: '📊' },
];

export default function TeamMemberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);

    Promise.all([
      managerService.getTeamMember(id),
      managerService.getTasks(),
      managerService.getProjects(),
    ])
      .then(([m, allTasks, allProjects]) => {
        if (!mounted) return;
        if (m) setMember(m);
        setTasks(allTasks.filter((t) => t.assignedTo === id));
        setProjects(allProjects.filter((p) => p.assignedEmployees?.includes(id)));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load member profile');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Team Member Profile" navItems={navItems}>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!member) {
    return (
      <DashboardLayout title="Team Member Profile" navItems={navItems}>
        <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200">
          <p className="text-slate-600 text-lg font-medium">Team member not found</p>
          <Button onClick={() => navigate(ROUTES.MANAGER_TEAM)} className="mt-4">
            ← Back to Team Directory
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Team / ${member.name}`} navItems={navItems}>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(ROUTES.MANAGER_TEAM)} className="mb-4">
          ← Back to Team Directory
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              {member.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{member.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : member.status === 'on_leave'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {member.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {member.role} • {member.department}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate(ROUTES.MANAGER_TASKS)}>Assign New Task</Button>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      {/* Info and Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Workload</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{member.workload}%</p>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
            <div
              className={`h-full rounded-full ${
                member.workload > 80 ? 'bg-red-500' : member.workload > 60 ? 'bg-orange-500' : 'bg-blue-600'
              }`}
              style={{ width: `${member.workload}%` }}
            />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Tasks Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{member.tasksCompleted}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Active Tasks</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {tasks.filter((t) => t.status !== 'completed').length}
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Assigned Projects</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{projects.length}</p>
        </div>
      </div>

      {/* Details & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Contact & Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Email</span>
              <span className="font-medium text-slate-800">{member.email}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Phone</span>
              <span className="font-medium text-slate-800">{member.phone || '+1 (555) 000-0000'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Joined</span>
              <span className="font-medium text-slate-800">
                {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'Jan 2023'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Department</span>
              <span className="font-medium text-slate-800">{member.department}</span>
            </div>
          </div>

          {member.skills && member.skills.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Technical Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assigned Projects */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Assigned Projects</h3>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors"
                onClick={() => navigate(`${ROUTES.MANAGER_PROJECTS}/${proj.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 text-sm">{proj.name}</h4>
                  <span className="text-xs text-slate-500">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-slate-500 py-4">No active projects assigned</p>}
          </div>
        </div>
      </div>

      {/* Member Tasks */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Assigned Tasks ({tasks.length})</h3>
          <Button size="sm" onClick={() => navigate(ROUTES.MANAGER_TASKS)}>
            View All Tasks
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-xs">
                <th className="pb-3 font-medium">Task</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-900">{task.title}</td>
                  <td className="py-3 text-slate-600">{task.projectName || 'Main Project'}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : task.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : task.status === 'review'
                          ? 'bg-purple-100 text-purple-700'
                          : task.status === 'blocked'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{new Date(task.deadline).toLocaleDateString()}</td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No tasks assigned to this team member
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
