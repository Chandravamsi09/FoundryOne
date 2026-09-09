import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import clientService, { ClientInvoice, INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, InvoiceLineItem, InvoicePayment } from '../../../services/clientService';
import { ROUTES } from '../../../types/constants';
import { ArrowLeft, Calendar, DollarSign, FileText, Download, CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

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

export default function ClientInvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<ClientInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      const clientId = (user as any)?.id || 'client_demo_001';
      const data = await clientService.getInvoice(clientId, id);
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Invoice Details" navItems={navItems} role="client">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-slate-500">Loading invoice...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!invoice) {
    return (
      <DashboardLayout title="Invoice Details" navItems={navItems} role="client">
        <div className="text-center py-20">
          <p className="text-sm text-slate-500 mb-4">Invoice not found or you do not have access.</p>
          <Button variant="primary" onClick={() => navigate(ROUTES.CLIENT_INVOICES)}>Back to Invoices</Button>
        </div>
      </DashboardLayout>
    );
  }

  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <DashboardLayout title="Invoice Details" navItems={navItems} role="client">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <button onClick={() => navigate(ROUTES.CLIENT_INVOICES)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </button>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{invoice.invoiceNumber}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${INVOICE_STATUS_COLORS[invoice.status]}`}>
                  {INVOICE_STATUS_LABELS[invoice.status]}
                </span>
              </div>
              <p className="text-sm text-slate-500">{invoice.projectName}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">${invoice.total.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">Total Amount</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500 mb-1">Issue Date</p>
              <p className="text-sm font-medium text-slate-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500 mb-1">Due Date</p>
              <p className="text-sm font-medium text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            {invoice.paidDate && (
              <div className="p-3 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500 mb-1">Paid Date</p>
                <p className="text-sm font-medium text-slate-900">{new Date(invoice.paidDate).toLocaleDateString()}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500 mb-1">Currency</p>
              <p className="text-sm font-medium text-slate-900">{invoice.currency}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Line Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200/60">
                  <th className="text-left text-xs font-semibold text-slate-500 pb-3">Description</th>
                  <th className="text-right text-xs font-semibold text-slate-500 pb-3">Qty</th>
                  <th className="text-right text-xs font-semibold text-slate-500 pb-3">Unit Price</th>
                  <th className="text-right text-xs font-semibold text-slate-500 pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 text-sm text-slate-900">{item.description}</td>
                    <td className="py-3 text-sm text-slate-600 text-right">{item.quantity}</td>
                    <td className="py-3 text-sm text-slate-600 text-right">${item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-sm font-medium text-slate-900 text-right">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax</span>
              <span className="font-medium text-slate-900">${invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-slate-200/60">
              <span className="text-slate-900">Total</span>
              <span className="text-slate-900">${invoice.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {invoice.payments.length > 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Payment History</h3>
            <div className="space-y-3">
              {invoice.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{payment.method}</p>
                      <p className="text-xs text-slate-500">{payment.transactionId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
