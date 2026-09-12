import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { ROUTES } from '../../types/constants';
import managerService from '../../services/managerService';
import { Approval } from '../../types/manager';

const navItems = [
  { path: ROUTES.MANAGER_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MANAGER_TEAM, label: 'My Team', icon: '👥' },
  { path: ROUTES.MANAGER_PROJECTS, label: 'Projects', icon: '🚀' },
  { path: ROUTES.MANAGER_TASKS, label: 'Tasks', icon: '✅' },
  { path: ROUTES.MANAGER_APPROVALS, label: 'Approvals', icon: '📋' },
  { path: ROUTES.MANAGER_REPORTS, label: 'Reports', icon: '📈' },
  { path: ROUTES.MANAGER_ANALYTICS, label: 'Analytics', icon: '📊' },
];

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  changes_requested: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Changes Requested' },
};

export default function Approvals() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | 'changes_requested'>('approved');
  const [reviewComments, setReviewComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadApprovals = () => {
    let mounted = true;
    setLoading(true);
    setError('');
    managerService
      .getApprovals()
      .then((data) => {
        if (mounted) setApprovals(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load approvals');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanup = loadApprovals();
    return cleanup;
  }, []);

  const filtered = filter ? approvals.filter((a) => a.status === filter) : approvals;

  const handleReview = async (approvalId: string) => {
    setSubmitting(true);
    try {
      const updated = await managerService.updateApprovalStatus(approvalId, reviewAction, reviewComments);
      if (updated) {
        setApprovals((prev) => prev.map((a) => (a.id === approvalId ? updated : a)));
        setReviewing(null);
        setReviewComments('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process approval');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Approvals" navItems={navItems}>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;

  return (
    <DashboardLayout title="Approvals" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Approvals Management</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve, or reject employee leave requests, expense reports, timesheets, and deliverables.
        </p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{approvedCount}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{rejectedCount}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Total Requests</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{approvals.length}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ['', 'All Requests'],
          ['pending', `Pending (${pendingCount})`],
          ['approved', 'Approved'],
          ['rejected', 'Rejected'],
          ['changes_requested', 'Changes Requested'],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              filter === value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Approvals Cards */}
      <div className="space-y-4">
        {filtered.map((approval) => {
          const config = statusConfig[approval.status] || {
            bg: 'bg-slate-100',
            text: 'text-slate-700',
            label: approval.status,
          };
          return (
            <div
              key={approval.id}
              className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>
                    {config.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-lg">
                    {approval.type}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Requested {approval.date || new Date(approval.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{approval.title}</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{approval.description}</p>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {approval.requesterName.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className="text-sm font-medium text-slate-700">Submitted by {approval.requesterName}</span>
              </div>

              {approval.reviewComments && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Manager Decision Notes</p>
                  <p className="text-sm text-slate-700 mt-1">{approval.reviewComments}</p>
                </div>
              )}

              {reviewing === approval.id ? (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">Decision:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewAction('approved')}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                          reviewAction === 'approved' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewAction('changes_requested')}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                          reviewAction === 'changes_requested'
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        Request Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewAction('rejected')}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                          reviewAction === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Comments / Feedback</label>
                    <textarea
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      placeholder="Add review feedback, reason for rejection, or change requirements..."
                      rows={2}
                      className="w-full px-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleReview(approval.id)} loading={submitting}>
                      Submit Decision
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setReviewing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : approval.status === 'pending' ? (
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    onClick={() => {
                      setReviewing(approval.id);
                      setReviewAction('approved');
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setReviewing(approval.id);
                      setReviewAction('changes_requested');
                    }}
                  >
                    Request Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setReviewing(approval.id);
                      setReviewAction('rejected');
                    }}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                  Reviewed on {approval.reviewedAt ? new Date(approval.reviewedAt).toLocaleString() : 'N/A'} by{' '}
                  {approval.reviewedBy || 'Manager'}
                </p>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-12 text-center text-slate-500">
            No approvals found under this filter.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
