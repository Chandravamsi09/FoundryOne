import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings, User, Users, Briefcase
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, ROLES, ROLE_GRADIENTS, ROLE_FEATURES, ROUTES } from '../types/constants';
import RoleCard from '../components/RoleCard';
import { Role } from '../types/constants';

const roleIcons: Record<string, React.ReactNode> = {
  [ROLES.ADMIN]: <Settings className="w-7 h-7 text-white" aria-hidden="true" />,
  [ROLES.EMPLOYEE]: <User className="w-7 h-7 text-white" aria-hidden="true" />,
  [ROLES.MANAGER]: <Users className="w-7 h-7 text-white" aria-hidden="true" />,
  [ROLES.CLIENT]: <Briefcase className="w-7 h-7 text-white" aria-hidden="true" />,
};

export default function LandingPage() {
  const navigate = useNavigate();

  const handleRoleClick = (role: Role) => {
    const routeMap: Record<string, string> = {
      [ROLES.ADMIN]: ROUTES.ADMIN_LOGIN,
      [ROLES.EMPLOYEE]: ROUTES.EMPLOYEE_LOGIN,
      [ROLES.MANAGER]: ROUTES.MANAGER_LOGIN,
      [ROLES.CLIENT]: ROUTES.CLIENT_LOGIN,
    };
    navigate(routeMap[role]);
  };

  const roles = [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.CLIENT];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-40 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-xl shadow-blue-500/30 mb-6">
            <span className="text-4xl font-bold text-white">F</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
            {APP_NAME}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-500 font-medium">
            {APP_TAGLINE}
          </p>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
            Enterprise SaaS Platform for modern teams. Select your role to continue.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {roles.map((role, index) => (
            <RoleCard
              key={role}
              role={role as Role}
              icon={roleIcons[role as keyof typeof roleIcons]}
              features={ROLE_FEATURES[role as keyof typeof ROLE_FEATURES]}
              gradient={ROLE_GRADIENTS[role as keyof typeof ROLE_GRADIENTS]}
              index={index}
              onClick={handleRoleClick}
            />
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16 text-sm text-slate-400"
        >
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="mt-1">Enterprise-grade authentication and authorization.</p>
        </motion.footer>
      </div>
    </div>
  );
}