import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';
import { User } from 'lucide-react';
import { ROLES, ROUTES } from '../types/constants';

export default function EmployeeLogin() {
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
      await login({ ...credentials, role: ROLES.EMPLOYEE });
      const target = from || ROUTES.EMPLOYEE_DASHBOARD;
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role={ROLES.EMPLOYEE}
      roleTitle="Employee"
      roleDescription="Access your daily tasks, projects, and attendance"
      roleIcon={<User className="w-12 h-12 text-white" />}
    >
      <LoginForm
        role={ROLES.EMPLOYEE}
        roleIcon={<User className="w-6 h-6 text-white" />}
        roleTitle="Employee"
        roleDescription="Access your daily tasks, projects, and attendance"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}