import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Palmtree,
  Stethoscope,
  Plane,
  Baby,
  FileText,
  Filter,
  Check
} from 'lucide-react';
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
  { path: '/employee/tasks/board', label: 'Task Board', icon: '📋' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

const leaveTypeConfig: Record<LeaveType, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  casual: {
    label: 'Casual Leave',
    icon: <Palmtree className="w-5 h-5 text-blue-600" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  sick: {
    label: 'Sick Leave',
    icon: <Stethoscope className="w-5 h-5 text-emerald-600" />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  annual: {
    label: 'Annual Leave',
    icon: <Plane className="w-5 h-5 text-purple-600" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  maternity: {
    label: 'Maternity Leave',
    icon: <Baby className="w-5 h-5 text-pink-600" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200'
  },
  paternity: {
    label: 'Paternity Leave',
    icon: <Baby className="w-5 h-5 text-indigo-600" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200'
  },
  unpaid: {
    label: 'Unpaid Leave',
    icon: <FileText className="w-5 h-5 text-amber-600" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
};

const leaveTypes = Object.entries(leaveTypeConfig).map(([value, config]) => ({
  value: value as LeaveType,
  label: config.label
}));

export default function EmployeeLeave() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    type: 'casual' as LeaveType,
    startDate: '',
    endDate: '',
    reason: ''
  });

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
      setError('Failed to load leave data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e) || e < s) return 0;
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const requestedDuration = calculateDays(formData.startDate, formData.endDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (formData.endDate < formData.startDate) {
      setFormError('End date cannot be earlier than start date.');
      return;
    }
    try {
      setSubmitting(true);
      setFormError('');
      await employeeService.applyLeave(formData);
      setFormData({ type: 'casual', startDate: '', endDate: '', reason: '' });
      setShowForm(false);
      setSuccessMessage('Leave application submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
      await loadData();
    } catch (err) {
      setFormError('Failed to apply for leave. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await employeeService.cancelLeave(id);
      setSuccessMessage('Leave request cancelled.');
      setTimeout(() => setSuccessMessage(''), 4000);
      await loadData();
    } catch (err) {
      setError('Failed to cancel leave request.');
    }
  };

  const openFormForType = (type: LeaveType) => {
    setFormData((prev) => ({ ...prev, type }));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statusStyles: Record<LeaveStatus, { bg: string; text: string; dot: string; label: string }> = {
    pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending Approval' },
    approved: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
    rejected: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Rejected' },
    cancelled: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Cancelled' },
  };

  // High-level overview metrics
  const totalRemaining = balances.reduce((acc, b) => acc + (b.remaining || 0), 0);
  const totalUsed = balances.reduce((acc, b) => acc + (b.used || 0), 0);
  const pendingCount = leaves.filter((l) => l.status === 'pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'approved').length;

  const filteredLeaves = statusFilter === 'all'
    ? leaves
    : leaves.filter((l) => l.status === statusFilter);

  if (loading) {
    return (
      <DashboardLayout title="Leave" navItems={navItems}>
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-slate-500">Loading leave management records...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Leave" navItems={navItems}>
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Leave Management</span>
              <span className="text-2xl">🏖️</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Track your paid time off, view entitlements, and submit new leave requests.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md shadow-blue-500/20 transition"
            >
              {showForm ? (
                <>Close Form</>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Apply Leave
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {error && <ErrorMessage message={error} className="mb-2" />}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* Stat Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Remaining Days</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-1">{totalRemaining}</p>
                <p className="text-xs text-slate-400 mt-1">Total available across categories</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-inner">
                🗓️
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Taken</p>
                <p className="text-3xl font-extrabold text-indigo-600 mt-1">{totalUsed}</p>
                <p className="text-xs text-slate-400 mt-1">Approved time-off used this year</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-inner">
                ✈️
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
                <p className="text-xs text-slate-400 mt-1">Awaiting manager approval</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Requests</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{approvedCount}</p>
                <p className="text-xs text-slate-400 mt-1">Confirmed requests history</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
                ✅
              </div>
            </div>
          </div>
        </div>

        {/* Slide-down Apply Leave Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-blue-200/80 p-6 shadow-lg shadow-blue-500/5">
                <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">New Leave Application</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Submit your time-off request for supervisor review</p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-medium transition"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {formError && <ErrorMessage message={formError} className="mb-4" />}

                  {/* Leave Type Selector with Cards */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Leave Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {leaveTypes.map((lt) => {
                        const isSelected = formData.type === lt.value;
                        const config = leaveTypeConfig[lt.value];
                        return (
                          <button
                            key={lt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: lt.value })}
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="mb-2">{config.icon}</div>
                            <span className="text-xs font-bold text-slate-800">{config.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date selection & duration indicator */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FormInput
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <FormInput
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {requestedDuration > 0 && (
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-blue-800">
                      <span className="font-medium">Requested Leave Duration:</span>
                      <span className="font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {requestedDuration} {requestedDuration === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  )}

                  <div>
                    <FormInput
                      label="Reason for Leave"
                      name="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      required
                      placeholder="e.g., Annual family reunion, personal health appointment..."
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" loading={submitting}>
                      Submit Application
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leave Entitlement & Balances Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Your Leave Entitlements</h3>
            <span className="text-xs text-slate-500">Yearly cycle balances</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {balances.map((balance) => {
              const config = leaveTypeConfig[balance.type] || {
                label: `${balance.type} Leave`,
                icon: <Calendar className="w-5 h-5 text-slate-500" />,
                color: 'text-slate-700',
                bg: 'bg-slate-50',
                border: 'border-slate-200'
              };
              const percentageUsed = Math.min(100, Math.round((balance.used / (balance.total || 1)) * 100));

              return (
                <div
                  key={balance.type}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shadow-inner`}>
                        {config.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 capitalize">{config.label}</h4>
                        <p className="text-xs text-slate-400">{balance.total} total days</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openFormForType(balance.type)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Apply
                    </button>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div>
                        <span className="text-2xl font-extrabold text-slate-900">{balance.remaining}</span>
                        <span className="text-xs text-slate-500 ml-1.5 font-medium">days remaining</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{balance.used} days used</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          percentageUsed > 80 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${percentageUsed}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave Requests & History Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Leave History & Requests</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track approvals, statuses, and past leave submissions</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'pending', 'approved', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                    statusFilter === f
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 text-xs uppercase tracking-wider text-slate-400">
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Dates & Duration</th>
                  <th className="text-left py-3 px-4 font-semibold">Reason</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.map((leave) => {
                  const config = leaveTypeConfig[leave.type] || {
                    label: leave.type,
                    icon: <Calendar className="w-4 h-4 text-slate-500" />
                  };
                  const status = statusStyles[leave.status] || statusStyles.cancelled;
                  const days = calculateDays(leave.startDate, leave.endDate);

                  return (
                    <tr key={leave.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-slate-100 text-slate-600">{config.icon}</span>
                          <span className="capitalize">{config.label || leave.type}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-medium text-slate-800">
                          {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} –{' '}
                          {new Date(leave.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <span className="text-xs text-slate-400 font-normal">
                          {days} {days === 1 ? 'day' : 'days'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{leave.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {leave.status === 'pending' ? (
                          <button
                            onClick={() => handleCancel(leave.id)}
                            className="px-3 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                          >
                            Cancel Request
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredLeaves.length === 0 && (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400 text-xl">
                  📄
                </div>
                <p className="text-sm font-semibold text-slate-700">No leave records found</p>
                <p className="text-xs text-slate-400 mt-1">
                  {statusFilter !== 'all'
                    ? `There are no ${statusFilter} leave requests right now.`
                    : 'You have not submitted any leave applications yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
