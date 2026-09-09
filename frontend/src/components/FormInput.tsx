import React, { useState } from 'react';

interface FormInputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  showToggle?: boolean;
  className?: string;
}

export default function FormInput({
  label, name, type = 'text', placeholder = '', value = '',
  onChange, error = '', required = false, disabled = false,
  showToggle = false, className = '', ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showToggle ? (showPassword ? 'text' : 'password') : type;
  const inputId = `input-${name}-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full px-4 py-3 text-sm border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500'
          }`}
          {...props}
        />
        {type === 'password' && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.873 16.509a9 9 0 01-3.873-3.873m2.25 2.25a9 9 0 003.873-3.873m-3.873 3.873L21 21M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 2c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="text-xs text-red-600" role="alert">{error}</span>
      )}
    </div>
  );
}