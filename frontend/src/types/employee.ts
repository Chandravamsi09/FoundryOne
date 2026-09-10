export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type LeaveType = 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity' | 'unpaid';
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'late' | 'on_leave';
export type NotificationType = 'task' | 'project' | 'leave' | 'attendance' | 'message' | 'system';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string;
  createdAt: string;
  updatedAt: string;
  comments: TaskComment[];
  history: TaskHistory[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold' | 'planned';
  progress: number;
  startDate: string;
  endDate: string;
  managerId: string;
  managerName: string;
  members: ProjectMember[];
  tasks: ProjectTaskSummary[];
  recentActivity: ProjectActivity[];
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface ProjectTaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface ProjectActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface Attendance {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface Leave {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerName?: string;
  notes?: string;
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  avatar?: string;
  address?: string;
  emergencyContact?: string;
  skills?: string[];
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  totalProjects: number;
  activeProjects: number;
  attendanceThisMonth: number;
  leaveBalance: number;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  projectId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: 'dueDate' | 'priority' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
