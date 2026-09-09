import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/Button';
import FormInput from '../../../components/FormInput';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import clientService, { ClientProfile, UpdateProfileData, NotificationPreferences } from '../../../services/clientService';
import { ROUTES } from '../../../types/constants';
import { User, Mail, Phone, Building2, MapPin, Save, Bell } from 'lucide-react';

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

export default function ClientProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const clientId = (user as any)?.id || 'client_demo_001';
      const data = await clientService.getProfile(clientId);
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const clientId = (user as any)?.id || 'client_demo_001';
      const updated = await clientService.updateProfile(clientId, formData);
      setProfile(updated);
      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Profile" navItems={navItems} role="client">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-slate-500">Loading profile...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout title="Profile" navItems={navItems} role="client">
        <div className="text-center py-20">
          <p className="text-sm text-slate-500">Profile not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile" navItems={navItems} role="client">
      <div className="max-w-2xl mx-auto space-y-6">
        {error && <ErrorMessage message={error} />}
        {success && <div className="p-4 rounded-xl bg-green-50/80 border border-green-200 text-green-700 text-sm">{success}</div>}

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Client Profile</h3>
                <p className="text-xs text-slate-500">Manage your account information</p>
              </div>
            </div>
            {!editing && (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Company Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required icon={<Building2 className="w-4 h-4" />} />
                <FormInput label="Email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required icon={<Mail className="w-4 h-4" />} />
                <FormInput label="Phone" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required icon={<Phone className="w-4 h-4" />} />
                <FormInput label="Address" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required icon={<MapPin className="w-4 h-4" />} />
                <FormInput label="City" name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                <FormInput label="Country" name="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
                <FormInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>Save Changes</Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Company</span>
                <span className="text-sm font-medium text-slate-900">{profile.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm font-medium text-slate-900">{profile.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Phone</span>
                <span className="text-sm font-medium text-slate-900">{profile.phone}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Address</span>
                <span className="text-sm font-medium text-slate-900">{profile.address}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">City</span>
                <span className="text-sm font-medium text-slate-900">{profile.city}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Country</span>
                <span className="text-sm font-medium text-slate-900">{profile.country}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Postal Code</span>
                <span className="text-sm font-medium text-slate-900">{profile.postalCode}</span>
              </div>
              {profile.taxId && (
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-slate-500">Tax ID</span>
                  <span className="text-sm font-medium text-slate-900">{profile.taxId}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-900">Change Password</h3>
          </div>
          <PasswordChangeForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

function PasswordChangeForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      const clientId = (user as any)?.id || 'client_demo_001';
      await clientService.changePassword(clientId, formData.currentPassword, formData.newPassword);
      setSuccess('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}
      {success && <div className="p-3 rounded-xl bg-green-50/80 border border-green-200 text-green-700 text-sm">{success}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Current Password" name="currentPassword" type="password" value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} required showToggle />
        <FormInput label="New Password" name="newPassword" type="password" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} required showToggle />
        <FormInput label="Confirm New Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required showToggle />
      </div>
      <Button type="submit" loading={loading}>Change Password</Button>
    </form>
  );
}
