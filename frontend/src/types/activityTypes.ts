export interface ActivityItem {
  id: string;
  actorId: string;
  actorName: string;
  action: 'created' | 'updated' | 'closed' | 'commented' | 'approved';
  targetType: 'task' | 'project' | 'leave' | 'invoice';
  targetId: string;
  timestamp: string;
  details?: Record<string, any>;
}
