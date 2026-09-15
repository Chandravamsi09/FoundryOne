export const TASK_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  todo: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  in_review: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' }
};

export const TASK_PRIORITY_WEIGHTS: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4
};
