import React from 'react';
import { TaskStatus } from '../../types/employee';

const statusStyles: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  on_hold: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'On Hold' },
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      {style.label}
    </span>
  );
}
