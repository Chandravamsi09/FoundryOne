import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';
import { Settings } from 'lucide-react';
import { ROLES, ROUTES } from '../types/constants';

export default function AdminLogin() {
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
      await login({ ...credentials, role: ROLES.ADMIN });
      const target = from || ROUTES.ADMIN_DASHBOARD;
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role={ROLES.ADMIN}
      roleTitle="Admin"
      roleDescription="System administration and security management"
      roleIcon={<Settings className="w-12 h-12 text-white" />}
    >
      <LoginForm
        role={ROLES.ADMIN}
        roleIcon={<Settings className="w-6 h-6 text-white" />}
        roleTitle="Admin"
        roleDescription="System administration and security management"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}