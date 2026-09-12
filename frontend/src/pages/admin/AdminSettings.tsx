import React, { useState, useEffect } from 'react';
import type { AdminSettings } from '../../types/admin';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';

type Tab = 'general' | 'security' | 'roles' | 'notifications';

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('general');

  useEffect(() => {
    (async () => {
      try {
        const mockData: AdminSettings = {
          general: {
            appName: 'FoundryOne Enterprise',
            supportEmail: 'support@foundryone.com',
            tagline: 'Build. Manage. Deliver.'
          },
          security: {
            mfaEnabled: true,
            passwordPolicy: 'strong',
            sessionTimeout: 30
          },
          roles: {
            admin: ['all'],
            employee: ['read', 'write'],
            manager: ['read', 'write', 'approve'],
            client: ['read']
          },
          notifications: {
            emailAlerts: true,
            pushNotifications: true,
            weeklyDigest: false
          }
        };
        setSettings(mockData);
      } catch (e) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (path: string[], value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [path[0]]: { ...(settings as any)[path[0]], [path[1]]: value } });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateSettings(settings as AdminSettings);
      alert('Settings saved successfully');
    } catch (e) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout title="Settings"><div className="p-12 flex justify-center"><div className="animate-spin text-blue-600 h-8 w-8" /></div></AdminLayout>;
  if (!settings) return <AdminLayout title="Settings"><ErrorMessage message={error} /></AdminLayout>;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'security', label: 'Security' },
    { key: 'roles', label: 'Roles' },
    { key: 'notifications', label: 'Notifications' },
  ];

  return (
    <AdminLayout title="Settings">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure application settings</p>
      </div>

      <ErrorMessage message={error} />

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'general' && (
            <div className="space-y-4 max-w-2xl">
              <FormInput name="app-name" label="App Name" value={settings.general.appName} onChange={(e) => update(['general', 'appName'], e.target.value)} />
              <FormInput name="tagline" label="Tagline" value={settings.general.tagline} onChange={(e) => update(['general', 'tagline'], e.target.value)} />
              <FormInput name="support-email" label="Support Email" type="email" value={settings.general.supportEmail} onChange={(e) => update(['general', 'supportEmail'], e.target.value)} />
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-900">Multi-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Require MFA for all admin accounts</p>
                </div>
                <button
                  onClick={() => update(['security', 'mfaEnabled'], !settings.security.mfaEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.mfaEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.mfaEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Session Timeout (minutes)</label>
                <input
                  name="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => update(['security', 'sessionTimeout'], Number(e.target.value))}
                  className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Password Policy</label>
                <select
                  name="password-policy"
                  value={settings.security.passwordPolicy}
                  onChange={(e) => update(['security', 'passwordPolicy'], e.target.value)}
                  className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="strong">Strong</option>
                  <option value="very-strong">Very Strong</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'roles' && (
            <div className="space-y-4 max-w-2xl">
              {Object.entries(settings.roles).map(([role, perms]) => (
                <div key={role} className="p-4 rounded-xl border border-slate-200">
                  <p className="text-sm font-medium text-slate-900 capitalize mb-2">{role}</p>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((perm) => (
                      <span key={perm} className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">{perm}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4 max-w-2xl">
              {[
                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive alerts via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary email' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => update(['notifications', item.key], !(settings.notifications as any)[item.key])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(settings.notifications as any)[item.key] ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(settings.notifications as any)[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} loading={saving}>Save Settings</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
