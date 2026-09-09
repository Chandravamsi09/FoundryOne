import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import clientService, { ClientPayment, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '../../../services/clientService';
import { ROUTES } from '../../../types/constants';
import { DollarSign, Calendar, CreditCard, ArrowRight, Filter } from 'lucide-react';

const navItems = [
  { path: ROUTES.CLIENT_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.CLIENT_PROJECTS, label: 'My Projects', icon: '🚀' },
  { path: ROUTES.CLIENT_CONTRACTS, label: 'Contracts', icon: '📄' },
  { path: ROUTES.CLIENT_INVOICES, label: 'Invoices', icon: '💳' },
  { path: ROUTES.CLIENT_PAYMENTS, label: 'Payments', icon: '💰' },
  { path: ROUTES.CLIENT_SUPPORT, label: 'Support', icon: '🎫' },
  { path: ROUTES.CLIENT_NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
  { path: ROUTES.CLIENT_PROFILE, label: 'Profile', icon: '👤' },
];

export default function ClientPayments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError('');
      const clientId = (user as any)?.id || 'client_demo_001';
      const data = await clientService.getPayments(clientId, { startDate: startDate || undefined, endDate: endDate || undefined });
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout title="Payment History" navItems={navItems} role="client">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={loadPayments} icon={<Filter className="w-4 h-4" />}>Apply Filters</Button>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Total Payments</h3>
            <p className="text-2xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" />
              <span className="text-sm text-slate-500">Loading payments...</span>
            </div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No payments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate(`${ROUTES.CLIENT_INVOICES}/${payment.invoiceId}`)}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">{payment.invoiceNumber}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PAYMENT_STATUS_COLORS[payment.status]}`}>
                          {PAYMENT_STATUS_LABELS[payment.status]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{payment.projectName}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(payment.date).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span>{payment.method}</span>
                        <span>•</span>
                        <span className="font-mono">{payment.transactionId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-slate-900">${payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">{payment.currency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
