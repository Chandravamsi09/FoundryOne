import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/Button';
import FormInput from '../../../components/FormInput';
import ErrorMessage from '../../../components/ErrorMessage';
import clientService, { TICKET_PRIORITY, TICKET_PRIORITY_LABELS, TICKET_CATEGORIES, CreateTicketData } from '../../../services/clientService';
import { ROUTES } from '../../../types/constants';
import { ArrowLeft, Send } from 'lucide-react';

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

export default function ClientSupportCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<CreateTicketData>({
    subject: '',
    category: TICKET_CATEGORIES[0],
    priority: TICKET_PRIORITY.MEDIUM,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const clientId = (user as any)?.id || 'client_demo_001';
      const ticket = await clientService.createTicket(clientId, formData);
      setSuccess('Ticket created successfully!');
      setTimeout(() => navigate(`${ROUTES.CLIENT_SUPPORT}/${ticket.id}`), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Support Ticket" navItems={navItems} role="client">
      <div className="max-w-2xl mx-auto space-y-6">
        {error && <ErrorMessage message={error} />}
        {success && <div className="p-4 rounded-xl bg-green-50/80 border border-green-200 text-green-700 text-sm">{success}</div>}

        <button onClick={() => navigate(ROUTES.CLIENT_SUPPORT)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Support
        </button>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Create New Ticket</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Subject" name="subject" placeholder="Brief description of your issue" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                  {TICKET_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })} className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                  {Object.entries(TICKET_PRIORITY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} placeholder="Describe your issue in detail..." required className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" />
            </div>
            <Button type="submit" loading={loading} icon={<Send className="w-4 h-4" />}>Submit Ticket</Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
