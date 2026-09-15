import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import ProjectCard from '../../components/employee/ProjectCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import { Project } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

export default function EmployeeProjects() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Projects" navItems={navItems}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Projects" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">My Projects</h2>
        <p className="text-sm text-slate-500 mt-1">View and manage your assigned projects</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => navigate(`/employee/projects/${project.id}`)} />
        ))}
      </div>
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">No projects assigned yet</p>
        </div>
      )}
    </DashboardLayout>
  );
}
