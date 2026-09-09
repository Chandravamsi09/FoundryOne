import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';
import { Users } from 'lucide-react';
import { ROLES, ROUTES } from '../types/constants';

export default function ManagerLogin() {
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
      await login({ ...credentials, role: ROLES.MANAGER });
      const target = from || ROUTES.MANAGER_DASHBOARD;
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role={ROLES.MANAGER}
      roleTitle="Manager"
      roleDescription="Team management, reports, and approvals"
      roleIcon={<Users className="w-12 h-12 text-white" />}
    >
      <LoginForm
        role={ROLES.MANAGER}
        roleIcon={<Users className="w-6 h-6 text-white" />}
        roleTitle="Manager"
        roleDescription="Team management, reports, and approvals"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}