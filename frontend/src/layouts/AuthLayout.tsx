import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { APP_NAME, ROUTES } from '../types/constants';

interface AuthLayoutProps {
  children: React.ReactNode;
  role: string;
  roleTitle: string;
  roleDescription: string;
  roleIcon: React.ReactNode;
  illustration?: React.ReactNode;
}

export default function AuthLayout({ children, roleTitle, roleDescription, roleIcon, illustration }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_50%)]" />
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl mb-8">
            {roleIcon}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{roleTitle} Portal</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            {roleDescription}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['Secure', 'Encrypted', 'SSO Ready', 'Enterprise'].map((badge) => (
              <span key={badge} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-slate-300 text-xs font-medium border border-white/10">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <Link
            to={ROUTES.LANDING}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Role Selection
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}