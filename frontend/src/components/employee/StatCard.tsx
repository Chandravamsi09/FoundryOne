import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const colorStyles: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
};

export default function StatCard({ title, value, color = 'blue', icon, onClick, className = '' }: StatCardProps) {
  const colors = colorStyles[color] || colorStyles.blue;
  return (
    <div
      onClick={onClick}
      className={`bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        {icon && <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>{icon}</div>}
      </div>
    </div>
  );
}
