import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import employeeService from '../../services/employeeService';
import { ROUTES } from '../../types/constants';
import type { EmployeeProfile } from '../../types/employee';

const navItems = [
  { path: ROUTES.EMPLOYEE_DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: '/employee/projects', label: 'My Projects', icon: '🚀' },
  { path: '/employee/tasks', label: 'My Tasks', icon: '✅' },
  { path: '/employee/attendance', label: 'Attendance', icon: '📅' },
  { path: '/employee/leave', label: 'Leave', icon: '🏖️' },
  { path: '/employee/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/employee/profile', label: 'Profile', icon: '👤' },
];

export default function EmployeeProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', newPassword: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    address: '',
    emergencyContact: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getProfile();
        setProfile(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          department: data.department,
          position: data.position,
          address: data.address || '',
          emergencyContact: data.emergencyContact || '',
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFormError('');
      const updated = await employeeService.updateProfile(formData);
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      setFormError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    try {
      setPasswordSaving(true);
      setPasswordError('');
      await employeeService.changePassword(passwordData.current, passwordData.newPassword);
      setPasswordData({ current: '', newPassword: '', confirm: '' });
      setShowPasswordForm(false);
      alert('Password changed successfully');
    } catch (err) {
      setPasswordError('Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Profile" navItems={navItems}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile" navItems={navItems}>
      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="max-w-3xl">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
              <p className="text-sm text-slate-500">{profile?.position} · {profile?.department}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
            {!editing && <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>}
          </div>

          {formError && <ErrorMessage message={formError} className="mb-4" />}

          {editing ? (
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Full Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <FormInput label="Email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <FormInput label="Phone" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                <FormInput label="Department" name="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                <FormInput label="Position" name="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
                <FormInput label="Address" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                <FormInput label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} />
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="submit" loading={saving}>Save Changes</Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: profile?.name },
                { label: 'Email', value: profile?.email },
                { label: 'Phone', value: profile?.phone },
                { label: 'Department', value: profile?.department },
                { label: 'Position', value: profile?.position },
                { label: 'Joined', value: profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : '-' },
                { label: 'Address', value: profile?.address },
                { label: 'Emergency Contact', value: profile?.emergencyContact },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-medium text-slate-900">{item.value || '-'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Security</h3>
            {!showPasswordForm && <Button size="sm" variant="secondary" onClick={() => setShowPasswordForm(true)}>Change Password</Button>}
          </div>

          {passwordError && <ErrorMessage message={passwordError} className="mb-4" />}

          {showPasswordForm && (
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4 max-w-md">
                <FormInput label="Current Password" name="currentPassword" type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} required />
                <FormInput label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                <FormInput label="Confirm New Password" name="confirmPassword" type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} required />
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="submit" loading={passwordSaving}>Update Password</Button>
                <Button type="button" variant="secondary" onClick={() => setShowPasswordForm(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
