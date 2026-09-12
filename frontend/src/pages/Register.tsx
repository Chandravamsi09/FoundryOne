import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import RegisterForm from '../components/RegisterForm';
import { UserCheck } from 'lucide-react';
import { ROLES, ROUTES } from '../types/constants';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRole = location.state?.defaultRole || '';

  const roleRedirects: Record<string, string> = {
    [ROLES.ADMIN]: ROUTES.ADMIN_LOGIN,
    [ROLES.EMPLOYEE]: ROUTES.EMPLOYEE_LOGIN,
    [ROLES.MANAGER]: ROUTES.MANAGER_LOGIN,
    [ROLES.CLIENT]: ROUTES.CLIENT_LOGIN,
  };

  const handleRegister = async (data: any) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await register(data);
      setSuccess(true);
      const target = roleRedirects[data.role] || ROUTES.LANDING;
      setTimeout(() => navigate(target, { replace: true }), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role={defaultRole || ROLES.EMPLOYEE}
      roleTitle="Registration"
      roleDescription="Create your FoundryOne account"
      roleIcon={<UserCheck className="w-12 h-12 text-white" />}
    >
      <RegisterForm onSubmit={handleRegister} loading={loading} error={error} defaultRole={defaultRole} />
      {success && (
        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-green-50/80 border border-green-200 text-green-700 text-sm backdrop-blur-sm" role="alert">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Account created successfully. Redirecting...</span>
        </div>
      )}
    </AuthLayout>
  );
}