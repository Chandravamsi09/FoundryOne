import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (e) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const maxUserGrowth = Math.max(...(analytics?.userGrowth?.map((u: any) => u.users) || [1]));

  return (
    <AdminLayout title="Analytics">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">System performance and growth insights</p>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <div className="p-12 flex justify-center"><div className="animate-spin text-blue-600 h-8 w-8" /></div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">User Growth</h3>
            <div className="flex items-end gap-4 h-64">
              {analytics?.userGrowth?.map((item: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-blue-600 rounded-t-xl transition-all duration-500" style={{ height: `${(item.users / maxUserGrowth) * 100}%`, minHeight: '8px' }} />
                  <span className="text-xs text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Role Distribution</h3>
              <div className="space-y-3">
                {analytics?.roleDistribution?.map((item: any, i: number) => {
                  const total = analytics.roleDistribution.reduce((a: number, b: any) => a + b.count, 0);
                  const pct = total ? (item.count / total) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">{item.role}</span>
                        <span className="font-medium text-slate-900">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Project Completion Rate</h3>
              <div className="flex items-center justify-center h-40">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke="#2563eb" strokeWidth="12" fill="none" strokeDasharray={`${analytics?.completionRate || 0} ${100 - (analytics?.completionRate || 0)}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{analytics?.completionRate || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Project Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {analytics?.projectStats?.map((item: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
                  <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
