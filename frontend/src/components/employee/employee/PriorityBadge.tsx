import React from 'react';
import { TaskPriority } from '../../types/employee';

const priorityStyles: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Low' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Medium' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
  urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent' },
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export default function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const style = priorityStyles[priority] || priorityStyles.medium;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      {style.label}
    </span>
  );
}
