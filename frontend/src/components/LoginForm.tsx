import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { validateEmail, validatePassword } from '../utils/validation';
import FormInput from './FormInput';
import ErrorMessage from './ErrorMessage';
import Button from './Button';
import { Role } from '../types/constants';

interface LoginFormProps {
  role: Role;
  roleIcon: React.ReactNode;
  roleTitle: string;
  roleDescription: string;
  onSubmit: (credentials: { email: string; password: string; rememberMe: boolean }) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function LoginForm({ role, roleIcon, roleTitle, roleDescription, onSubmit, loading = false, error = '' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState(error);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;
    try {
      await onSubmit({ email, password, rememberMe });
    } catch (err: any) {
      setSubmitError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleSSO = (provider: string) => {
    setSubmitError(`SSO login for ${provider} is not configured yet. Please use email and password.`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          {roleIcon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{roleTitle} Login</h2>
          <p className="text-sm text-slate-500">{roleDescription}</p>
        </div>
      </div>

      <ErrorMessage message={submitError} className="mb-5" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
          disabled={loading}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
          disabled={loading}
          showToggle
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none">
            Forgot Password?
          </a>
        </div>

        <Button type="submit" variant="primary" size="lg" loading={loading} glow className="w-full">
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" size="md" onClick={() => handleSSO('Google')} disabled={loading} className="w-full">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C14.7 3.7 13.5 3 12 3 6.9 3 2.7 7.2 2.7 12.1S6.9 21 12 21c5.9 0 9.2-4.3 9.2-10.3 0-.7-.1-1.2-.2-1.5H12z" />
            </svg>
            Google
          </Button>
          <Button type="button" variant="outline" size="md" onClick={() => handleSSO('Microsoft')} disabled={loading} className="w-full">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#F25022" d="M1 1h10v10H1V1zm12 0h10v10H13V1zM1 13h10v10H1V13zm12 0h10v10H13V13z" />
            </svg>
            Microsoft
          </Button>
        </div>

        <div className="text-center text-sm text-slate-500 mt-2">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Create Account
          </a>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Secure authentication & encrypted connection</span>
      </div>
    </motion.div>
  );
}