import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';
import { Briefcase } from 'lucide-react';
import { ROLES, ROUTES } from '../types/constants';

export default function ClientLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const handleLogin = async (credentials: any) => {
    setLoading(true);
    setError('');
    try {
      await login({ ...credentials, role: ROLES.CLIENT });
      const target = from || ROUTES.CLIENT_DASHBOARD;
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role={ROLES.CLIENT}
      roleTitle="Client"
      roleDescription="View projects, contracts, invoices, and support"
      roleIcon={<Briefcase className="w-12 h-12 text-white" />}
    >
      <LoginForm
        role={ROLES.CLIENT}
        roleIcon={<Briefcase className="w-6 h-6 text-white" />}
        roleTitle="Client"
        roleDescription="View projects, contracts, invoices, and support"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}
