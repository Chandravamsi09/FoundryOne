import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  validateName, validateEmail, validatePhone,
  validatePassword, validateConfirmPassword, validateRequired
} from '../utils/validation';
import FormInput from './FormInput';
import ErrorMessage from './ErrorMessage';
import Button from './Button';
import { Role, ROLES, ROLE_LABELS } from '../types/constants';

interface RegisterFormProps {
  onSubmit: (data: { name: string; email: string; phone: string; password: string; confirmPassword: string; role: Role }) => Promise<void>;
  loading?: boolean;
  error?: string;
  defaultRole?: string;
}

export default function RegisterForm({ onSubmit, loading = false, error = '', defaultRole = '' }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string>(defaultRole || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState(error);

  React.useEffect(() => {
    setSubmitError(error);
  }, [error]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    newErrors.name = validateName(name);
    newErrors.email = validateEmail(email);
    newErrors.phone = validatePhone(phone);
    newErrors.password = validatePassword(password);
    newErrors.confirmPassword = validateConfirmPassword(password, confirmPassword);
    newErrors.role = validateRequired(role, 'Role');
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;
    try {
      await onSubmit({ name, email, phone, password, confirmPassword, role: role as Role });
    } catch (err: any) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    }
  };

  const availableRoles: Role[] = [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.CLIENT];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-sm text-slate-500">Register for a new FoundryOne account</p>
        </div>
      </div>

      <ErrorMessage message={submitError} className="mb-5" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormInput label="Full Name" name="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required disabled={loading} />
        <FormInput label="Email Address" name="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required disabled={loading} />
        <FormInput label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} required disabled={loading} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Role <span className="text-red-500 ml-1">*</span></label>
          <div className="grid grid-cols-3 gap-2">
            {availableRoles.map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)} disabled={loading}
                className={`py-2.5 px-3 text-sm rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  role === r ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                }`}
                aria-pressed={role === r}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
          {errors.role && <span className="text-xs text-red-600" role="alert">{errors.role}</span>}
        </div>

        <FormInput label="Password" name="password" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required disabled={loading} showToggle />
        <FormInput label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} required disabled={loading} showToggle />

        <Button type="submit" variant="primary" size="lg" loading={loading} glow className="w-full">
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign In
          </a>
        </div>
      </form>
    </motion.div>
  );
}