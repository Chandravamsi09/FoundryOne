export interface DashboardStats {
  teamSize: number;
  activeProjects: number;
  pendingTasks: number;
  pendingApprovals: number;
  completedProjects?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'on_leave' | 'inactive';
  avatar?: string;
  currentProject?: string;
  tasksCompleted: number;
  workload: number;
  phone?: string;
  joinDate?: string;
  skills?: string[];
}

export interface ProjectActivity {
  user: string;
  action: string;
  details?: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'on_track' | 'at_risk' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  deadline: string;
  budget?: number;
  managerId: string;
  assignedEmployees: string[];
  activity: ProjectActivity[];
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId: string;
  projectName?: string;
  assignedTo: string;
  assignedToName?: string;
  deadline: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  type: 'Leave Request' | 'Expense Report' | 'Timesheet' | 'Project Deliverable';
  title: string;
  description: string;
  requester: string;
  requesterName: string;
  requesterId: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  date: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComments?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  projectId?: string;
  department?: string;
}

export interface ProductivityTrend {
  week: string;
  tasksCompleted: number;
  hoursLogged: number;
}

export interface ProjectProgressItem {
  id: string;
  name: string;
  progress: number;
  status: string;
}

export interface TaskCompletionItem {
  date: string;
  completed: number;
  created: number;
}

export interface EmployeeWorkloadItem {
  id: string;
  name: string;
  department: string;
  workload: number;
  pendingTasks: number;
}

export interface DeadlinePerformanceItem {
  project: string;
  deadline: string;
  onTrack: boolean;
  daysRemaining: number;
}
