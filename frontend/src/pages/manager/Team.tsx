import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';
import { TeamMember } from '../../types/manager';

const navItems = [
  { path: ROUTES.MANAGER_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MANAGER_TEAM, label: 'My Team', icon: '👥' },
  { path: ROUTES.MANAGER_PROJECTS, label: 'Projects', icon: '🚀' },
  { path: ROUTES.MANAGER_TASKS, label: 'Tasks', icon: '✅' },
  { path: ROUTES.MANAGER_APPROVALS, label: 'Approvals', icon: '📋' },
  { path: ROUTES.MANAGER_REPORTS, label: 'Reports', icon: '📈' },
  { path: ROUTES.MANAGER_ANALYTICS, label: 'Analytics', icon: '📊' },
];

export default function Team() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Software Engineer',
    department: 'Engineering',
    phone: '',
  });

  const loadTeam = () => {
    let mounted = true;
    setLoading(true);
    managerService
      .getTeamMembers()
      .then((data) => {
        if (mounted) setTeam(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load team members');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanup = loadTeam();
    return cleanup;
  }, []);

  const departments = Array.from(new Set(team.map((m) => m.department)));

  const filteredTeam = team.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      (m.skills && m.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())));
    const matchesDept = departmentFilter ? m.department === departmentFilter : true;
    return matchesSearch && matchesDept;
  });

  const [submitting, setSubmitting] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    setSubmitting(true);
    setError('');
    try {
      const created = await managerService.addTeamMember({
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        department: newMember.department,
        phone: newMember.phone || '+1 (555) 000-0000',
      });

      setTeam((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewMember({ name: '', email: '', role: 'Software Engineer', department: 'Engineering', phone: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to add team member');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Team" navItems={navItems}>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const activeCount = team.filter((m) => m.status === 'active').length;
  const onLeaveCount = team.filter((m) => m.status === 'on_leave').length;
  const avgWorkload = team.length ? Math.round(team.reduce((acc, m) => acc + m.workload, 0) / team.length) : 0;

  return (
    <DashboardLayout title="My Team" navItems={navItems}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Manage team members, roles, workload, and performance.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Add Member</Button>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Total Members</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{team.length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">On Leave</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{onLeaveCount}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Avg Capacity</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{avgWorkload}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, role, or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => (
          <div
            key={member.id}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
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

              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Department</span>
                  <span className="font-medium text-slate-700">{member.department}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Project</span>
                  <span className="font-medium text-slate-700 truncate max-w-[160px]">{member.currentProject || 'Unassigned'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Tasks Completed</span>
                  <span className="font-semibold text-slate-900">{member.tasksCompleted}</span>
                </div>
              </div>

              {/* Workload Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Workload Capacity</span>
                  <span className="font-semibold text-slate-700">{member.workload}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      member.workload > 80 ? 'bg-red-500' : member.workload > 60 ? 'bg-orange-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${member.workload}%` }}
                  />
                </div>
              </div>

              {/* Skills Tags */}
              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {member.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-xs">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => navigate(`${ROUTES.MANAGER_TEAM}/${member.id}`)}
              >
                View Full Profile
              </Button>
            </div>
          </div>
        ))}

        {filteredTeam.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500">
            No team members found matching your search.
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Team Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <FormInput
                label="Full Name"
                name="name"
                placeholder="e.g. Jane Doe"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="jane.doe@foundryone.com"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                required
              />
              <FormInput
                label="Role / Title"
                name="role"
                placeholder="e.g. Senior Frontend Engineer"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <select
                  value={newMember.department}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Design">Design</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Product">Product</option>
                </select>
              </div>
              <FormInput
                label="Phone (optional)"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" loading={submitting} className="flex-1">
                  Add Member
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
