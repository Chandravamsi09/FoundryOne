import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import clientService, { ClientContract, CONTRACT_STATUS_LABELS, CONTRACT_STATUS_COLORS, ContractDocument, ContractHistoryEntry } from '../../../services/clientService';
import { ROUTES } from '../../../types/constants';
import { ArrowLeft, Calendar, DollarSign, FileText, Download, Clock, User } from 'lucide-react';

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

type Tab = 'details' | 'documents' | 'history';

export default function ClientContractDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ClientContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('details');

  useEffect(() => {
    if (id) loadContract();
  }, [id]);

  const loadContract = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      const clientId = (user as any)?.id || 'client_demo_001';
      const data = await clientService.getContract(clientId, id);
      setContract(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load contract details');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'details' as Tab, label: 'Details', icon: FileText },
    { id: 'documents' as Tab, label: 'Documents', icon: Download },
    { id: 'history' as Tab, label: 'History', icon: Clock },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Contract Details" navItems={navItems} role="client">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-slate-500">Loading contract...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!contract) {
    return (
      <DashboardLayout title="Contract Details" navItems={navItems} role="client">
        <div className="text-center py-20">
          <p className="text-sm text-slate-500 mb-4">Contract not found or you do not have access.</p>
          <Button variant="primary" onClick={() => navigate(ROUTES.CLIENT_CONTRACTS)}>Back to Contracts</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Contract Details" navItems={navItems} role="client">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <button onClick={() => navigate(ROUTES.CLIENT_CONTRACTS)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Contracts
        </button>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{contract.title}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${CONTRACT_STATUS_COLORS[contract.status]}`}>
                  {CONTRACT_STATUS_LABELS[contract.status]}
                </span>
              </div>
              <p className="text-sm text-slate-500">Project: {contract.projectName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">${contract.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Contract Value</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-200/60">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Contract Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Contract Title</span>
                <span className="text-sm font-medium text-slate-900">{contract.title}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Status</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONTRACT_STATUS_COLORS[contract.status]}`}>{CONTRACT_STATUS_LABELS[contract.status]}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Project</span>
                <span className="text-sm font-medium text-slate-900">{contract.projectName}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Value</span>
                <span className="text-sm font-medium text-slate-900">${contract.value.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Start Date</span>
                <span className="text-sm font-medium text-slate-900">{new Date(contract.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">End Date</span>
                <span className="text-sm font-medium text-slate-900">{new Date(contract.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Created</span>
                <span className="text-sm font-medium text-slate-900">{new Date(contract.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-slate-50/50">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Terms & Conditions</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{contract.terms}</p>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Contract Documents</h3>
            <div className="space-y-3">
              {contract.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.type} • {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Contract History</h3>
            <div className="space-y-4">
              {contract.history.map((entry, index) => (
                <div key={entry.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    {index < contract.history.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-slate-900">{entry.action}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{entry.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{entry.performedBy}</span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-400">{new Date(entry.performedAt).toLocaleString()}</span>
                    </div>
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
