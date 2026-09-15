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
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
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

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    managerService.getApprovals()
      .then((data) => { if (mounted) setApprovals(data); })
      .catch((err) => { if (mounted) setError(err.message || 'Failed to load approvals'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = filter ? approvals.filter(a => a.status === filter) : approvals;

  const handleReview = async (approvalId: string) => {
    setSubmitting(true);
    try {
      const updated = await managerService.updateApprovalStatus(approvalId, reviewAction, reviewComments);
      if (updated) {
        setApprovals(approvals.map(a => a.id === approvalId ? updated : a));
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
        <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Approvals" navItems={navItems}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Approvals</h2>
        <p className="text-sm text-slate-500 mt-1">Review and process pending requests</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="mb-6 flex flex-wrap gap-2">
        {[['', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['changes_requested', 'Changes Requested']].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              filter === value ? 'bg-blue-600 text-white' : 'bg-white/70 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((approval) => {
          const config = statusConfig[approval.status];
          return (
            <div key={approval.id} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${config.bg} ${config.text}`}>{config.label}</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{approval.type}</span>
                </div>
                <span className="text-xs text-slate-400">{new Date(approval.createdAt).toLocaleString()}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{approval.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{approval.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                  {approval.requesterName.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm font-medium text-slate-700">Requested by {approval.requesterName}</span>
              </div>
              {approval.reviewComments && (
                <div className="p-3 rounded-xl bg-slate-50 mb-4">
                  <p className="text-xs text-slate-500">Review Comments</p>
                  <p className="text-sm text-slate-700 mt-1">{approval.reviewComments}</p>
                </div>
              )}
              {reviewing === approval.id ? (
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Review Comments</label>
                    <textarea
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      placeholder="Add comments (optional)..."
                      rows={2}
                      className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleReview(approval.id)} loading={submitting}>Submit</Button>
                    <Button size="sm" variant="secondary" onClick={() => setReviewing(null)}>Cancel</Button>
                  </div>
                </div>
              ) : approval.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => { setReviewing(approval.id); setReviewAction('approved'); }}>Approve</Button>
                  <Button size="sm" variant="secondary" onClick={() => { setReviewing(approval.id); setReviewAction('changes_requested'); }}>Request Changes</Button>
                  <Button size="sm" variant="danger" onClick={() => { setReviewing(approval.id); setReviewAction('rejected'); }}>Reject</Button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Reviewed on {approval.reviewedAt ? new Date(approval.reviewedAt).toLocaleString() : 'N/A'}</p>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-slate-500 text-center py-10">No approvals found</p>}
      </div>
    </DashboardLayout>
  );
}
