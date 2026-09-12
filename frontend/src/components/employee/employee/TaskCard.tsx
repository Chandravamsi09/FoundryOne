import React from 'react';
import { Task } from '../../types/employee';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onStatusChange?: (status: Task['status']) => void;
  className?: string;
}

const statusActions: { label: string; value: Task['status'] }[] = [
  { label: 'Start', value: 'in_progress' },
  { label: 'Complete', value: 'completed' },
  { label: 'Hold', value: 'on_hold' },
  { label: 'Reopen', value: 'pending' },
];

export default function TaskCard({ task, onClick, onStatusChange, className = '' }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate">{task.title}</h4>
          <p className="text-xs text-slate-500 mt-1 truncate">{task.projectName}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        {onStatusChange && task.status !== 'completed' && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value as Task['status'])}
            onClick={(e) => e.stopPropagation()}
            className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Update</option>
            {statusActions.map((action) => (
              <option key={action.value} value={action.value}>{action.label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
