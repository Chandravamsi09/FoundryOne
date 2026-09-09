import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import clientService, { ClientSupportTicket, SupportMessage, TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, TICKET_PRIORITY_LABELS, TICKET_PRIORITY_COLORS } from '../../../services/clientService';
import { ROUTES } from '../../../types/constants';
import { ArrowLeft, Send, Clock, User, AlertCircle } from 'lucide-react';

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

export default function ClientSupportDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<ClientSupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) loadTicket();
  }, [id]);

  const loadTicket = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      const clientId = (user as any)?.id || 'client_demo_001';
      const data = await clientService.getTicket(clientId, id);
      setTicket(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticket) return;
    setSending(true);
    try {
      const clientId = (user as any)?.id || 'client_demo_001';
      const userName = (user as any)?.name || 'Client User';
      await clientService.addTicketMessage(ticket.id, newMessage, clientId, userName, 'client');
      setNewMessage('');
      await loadTicket();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Ticket Details" navItems={navItems} role="client">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-slate-500">Loading ticket...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout title="Ticket Details" navItems={navItems} role="client">
        <div className="text-center py-20">
          <p className="text-sm text-slate-500 mb-4">Ticket not found or you do not have access.</p>
          <Button variant="primary" onClick={() => navigate(ROUTES.CLIENT_SUPPORT)}>Back to Support</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Ticket Details" navItems={navItems} role="client">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <button onClick={() => navigate(ROUTES.CLIENT_SUPPORT)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Support
        </button>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-slate-500">{ticket.ticketNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TICKET_STATUS_COLORS[ticket.status]}`}>
                  {TICKET_STATUS_LABELS[ticket.status]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TICKET_PRIORITY_COLORS[ticket.priority]}`}>
                  {TICKET_PRIORITY_LABELS[ticket.priority]}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{ticket.subject}</h2>
              <p className="text-sm text-slate-500 mt-1">Category: {ticket.category}</p>
            </div>
            {ticket.assignedTo && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span>Assigned to: {ticket.assignedTo}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Messages</h3>
          <div className="space-y-4">
            {ticket.messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 p-4 rounded-xl ${message.authorRole === 'client' ? 'bg-blue-50/30 ml-8' : 'bg-slate-50/50 mr-8'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {message.authorName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{message.authorName}</span>
                    <span className="text-xs text-slate-400">{new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(ticket.status === 'open' || ticket.status === 'in_progress') && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Add Reply</h3>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} rows={3} placeholder="Type your message..." required className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" />
              <Button type="submit" loading={sending} icon={<Send className="w-4 h-4" />}>Send Message</Button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
