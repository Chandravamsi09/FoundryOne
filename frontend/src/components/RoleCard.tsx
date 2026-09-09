import React from 'react';
import { motion } from 'framer-motion';
import { Role, ROLE_LABELS, ROLE_DESCRIPTIONS } from '../types/constants';

interface RoleCardProps {
  role: Role;
  icon: React.ReactNode;
  features: string[];
  gradient: string;
  index: number;
  onClick: (role: Role) => void;
}

export default function RoleCard({ role, icon, features, gradient, index, onClick }: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{
        y: -8,
        rotate: Math.sin((index - 1.5) * 0.15) * -1.5,
        transition: { duration: 0.3, ease: 'easeInOut' },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(role)}
      className="group relative cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Select ${ROLE_LABELS[role]} role`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(role);
        }
      }}
    >
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(135deg, var(--rc-from, #2563eb), var(--rc-to, #7c3aed))` }}>
        <div className="absolute inset-0 rounded-2xl opacity-75 blur-xl group-hover:blur-2xl transition-all duration-500 -z-10 bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, var(--rc-from, #2563eb), var(--rc-to, #7c3aed))` }} />
        <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-wider">
              {ROLE_LABELS[role]}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
            {ROLE_LABELS[role]}
          </h3>
          <p className="text-sm text-slate-500 mb-4">{ROLE_DESCRIPTIONS[role]}</p>

          <div className="flex flex-wrap gap-2">
            {features.map((feature, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Continue to login
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0-4l-4-4m6 12H7a4 4 0 01-4-4V6a4 4 0 014-4h5m6 10l-5-5m0 5l5-5" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}