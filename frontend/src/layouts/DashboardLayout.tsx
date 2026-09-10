import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, ROLE_LABELS, ROLE_LOGIN_ROUTES } from '../types/constants';

interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

interface DashboardLayoutProps {
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export default function DashboardLayout({ title, navItems, children }: DashboardLayoutProps) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    const loginRoute = role ? ROLE_LOGIN_ROUTES[role as keyof typeof ROLE_LOGIN_ROUTES] || '/login/admin' : '/login/admin';
    navigate(loginRoute);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-2 p-4 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="font-bold text-slate-900">{APP_NAME}</span>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a key={item.path} href={item.path} onClick={(e) => { e.preventDefault(); navigate(item.path); setSidebarOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                {item.icon && <span className="text-base" aria-hidden="true">{item.icon}</span>}
                {item.label}
              </a>
            ))}
          </nav>
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-2 p-2 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
              {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-slate-500">{role ? ROLE_LABELS[role as keyof typeof ROLE_LABELS] : ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0-4l-4-4m6 12H7a4 4 0 01-4-4V6a4 4 0 014-4h5m6 10l-5-5m0 5l5-5" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none" aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-slate-900">{title || 'Dashboard'}</h1>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
