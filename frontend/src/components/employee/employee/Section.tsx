import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function Section({ title, children, className = '', action }: SectionProps) {
  return (
    <div className={`bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
