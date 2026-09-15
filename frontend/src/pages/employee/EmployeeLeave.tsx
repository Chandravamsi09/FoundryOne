import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import { Leave, LeaveBalance, LeaveType, LeaveStatus } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

const leaveTypes: { value: LeaveType; label: string }[] = [
  { value: 'casual', label: 'Casual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'annual', label: 'Annual Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

export default function EmployeeLeave() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({ type: 'casual' as LeaveType, startDate: '', endDate: '', reason: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [balanceData, leaveData] = await Promise.all([
        employeeService.getLeaveBalance(),
        employeeService.getLeaves(),
      ]);
      setBalances(balanceData);
      setLeaves(leaveData);
    } catch (err) {
      setError('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      setFormError('Please fill all fields');
      return;
    }
    if (formData.endDate < formData.startDate) {
      setFormError('End date cannot be before start date');
      return;
    }
    try {
      setSubmitting(true);
      setFormError('');
      await employeeService.applyLeave(formData);
      setFormData({ type: 'casual', startDate: '', endDate: '', reason: '' });
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError('Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await employeeService.cancelLeave(id);
      loadData();
    } catch (err) {
      setError('Failed to cancel leave');
    }
  };

  const statusStyles: Record<LeaveStatus, { bg: string; text: string }> = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-700' },
    approved: { bg: 'bg-green-100', text: 'text-green-700' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-700' },
  };

  if (loading) {
    return (
      <DashboardLayout title="Leave Management" navItems={navItems}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Leave Management" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Leave Management</h2>
          <p className="text-sm text-slate-500 mt-1">Apply for leave and view your history</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Apply Leave'}</Button>
      </div>

      {showForm && (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm mb-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Apply for Leave</h3>
          <form onSubmit={handleSubmit}>
            {formError && <ErrorMessage message={formError} className="mb-4" />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Leave Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LeaveType })}
                  className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {leaveTypes.map((lt) => <option key={lt.value} value={lt.value}>{lt.label}</option>)}
                </select>
              </div>
              <FormInput label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
              <FormInput label="End Date" name="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
              <div className="sm:col-span-2">
                <FormInput label="Reason" name="reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required placeholder="Reason for leave" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>Submit Application</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {balances.map((balance) => (
          <div key={balance.type} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500 capitalize">{balance.type} Leave</p>
            <div className="flex items-end justify-between mt-2">
              <div>
                <p className="text-2xl font-bold text-slate-900">{balance.remaining}</p>
                <p className="text-xs text-slate-500">remaining of {balance.total}</p>
              </div>
              <p className="text-sm text-slate-600">{balance.used} used</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(balance.used / balance.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Leave History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-medium text-slate-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-slate-500">Dates</th>
                <th className="text-left py-2 px-3 font-medium text-slate-500">Reason</th>
                <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                <th className="text-left py-2 px-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td className="py-2.5 px-3 text-slate-900 capitalize">{leave.type}</td>
                  <td className="py-2.5 px-3 text-slate-700">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="py-2.5 px-3 text-slate-700">{leave.reason}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[leave.status].bg} ${statusStyles[leave.status].text}`}>{leave.status}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    {leave.status === 'pending' && (
                      <Button size="sm" variant="danger" onClick={() => handleCancel(leave.id)}>Cancel</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaves.length === 0 && <p className="text-sm text-slate-500 text-center py-6">No leave history</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
