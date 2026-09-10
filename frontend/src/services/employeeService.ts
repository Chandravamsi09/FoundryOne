import api from './api';
import {
  Task, Project, Attendance, Leave, LeaveBalance, Notification,
  EmployeeProfile, DashboardStats, TaskFilters, PaginatedResponse, TaskComment, TaskHistory, ProjectActivity, LeaveType, LeaveStatus
} from '../types/employee';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () => `${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, days: number) => {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
};

const initialTasks: Task[] = [
  {
    id: 'task_1',
    title: 'Complete login module',
    description: 'Implement the employee login flow with form validation and error handling.',
    status: 'in_progress',
    priority: 'high',
    dueDate: formatDate(addDays(today, 2)),
    projectId: 'proj_1',
    projectName: 'Website Redesign',
    assigneeId: 'emp_1',
    assigneeName: 'Employee',
    createdAt: formatDate(addDays(today, -5)),
    updatedAt: formatDate(today),
    comments: [
      { id: 'cmt_1', taskId: 'task_1', userId: 'mgr_1', userName: 'Manager', text: 'Please prioritize the validation logic.', createdAt: formatDate(addDays(today, -1)) },
    ],
    history: [
      { id: 'hist_1', taskId: 'task_1', userId: 'mgr_1', userName: 'Manager', action: 'status', oldValue: 'pending', newValue: 'in_progress', createdAt: formatDate(addDays(today, -3)) },
    ],
  },
  {
    id: 'task_2',
    title: 'Fix navigation bug',
    description: 'Resolve the sidebar collapse issue on mobile devices.',
    status: 'pending',
    priority: 'medium',
    dueDate: formatDate(addDays(today, 5)),
    projectId: 'proj_1',
    projectName: 'Website Redesign',
    assigneeId: 'emp_1',
    assigneeName: 'Employee',
    createdAt: formatDate(addDays(today, -3)),
    updatedAt: formatDate(addDays(today, -3)),
    comments: [],
    history: [],
  },
  {
    id: 'task_3',
    title: 'Write unit tests',
    description: 'Add Jest tests for the new employee service methods.',
    status: 'completed',
    priority: 'medium',
    dueDate: formatDate(addDays(today, -1)),
    projectId: 'proj_2',
    projectName: 'API Integration',
    assigneeId: 'emp_1',
    assigneeName: 'Employee',
    createdAt: formatDate(addDays(today, -7)),
    updatedAt: formatDate(addDays(today, -1)),
    comments: [],
    history: [
      { id: 'hist_2', taskId: 'task_3', userId: 'emp_1', userName: 'Employee', action: 'status', oldValue: 'in_progress', newValue: 'completed', createdAt: formatDate(addDays(today, -1)) },
    ],
  },
  {
    id: 'task_4',
    title: 'Review PR #24',
    description: 'Review the pull request for the dashboard layout improvements.',
    status: 'pending',
    priority: 'low',
    dueDate: formatDate(addDays(today, 3)),
    projectId: 'proj_3',
    projectName: 'Mobile App Update',
    assigneeId: 'emp_1',
    assigneeName: 'Employee',
    createdAt: formatDate(addDays(today, -2)),
    updatedAt: formatDate(addDays(today, -2)),
    comments: [],
    history: [],
  },
  {
    id: 'task_5',
    title: 'Update documentation',
    description: 'Update the API documentation for the new endpoints.',
    status: 'pending',
    priority: 'low',
    dueDate: formatDate(addDays(today, 7)),
    projectId: 'proj_2',
    projectName: 'API Integration',
    assigneeId: 'emp_1',
    assigneeName: 'Employee',
    createdAt: formatDate(addDays(today, -1)),
    updatedAt: formatDate(addDays(today, -1)),
    comments: [],
    history: [],
  },
  {
    id: 'task_6',
    title: 'Design system tokens',
    description: 'Define color, spacing, and typography tokens for the design system.',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: formatDate(today),
    projectId: 'proj_1',
    projectName: 'Website Redesign',
    assigneeId: 'emp_1',
    assigneeName: 'Employee',
    createdAt: formatDate(addDays(today, -4)),
    updatedAt: formatDate(today),
    comments: [],
    history: [],
  },
];

const initialProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX.',
    status: 'active',
    progress: 75,
    startDate: formatDate(addDays(today, -30)),
    endDate: formatDate(addDays(today, 15)),
    managerId: 'mgr_1',
    managerName: 'Sarah Manager',
    members: [
      { id: 'emp_1', name: 'Employee', email: 'employee@foundryone.com', role: 'Developer' },
      { id: 'mgr_1', name: 'Sarah Manager', email: 'manager@foundryone.com', role: 'Project Manager' },
    ],
    tasks: [
      { id: 'task_1', title: 'Complete login module', status: 'in_progress', priority: 'high', dueDate: formatDate(addDays(today, 2)) },
      { id: 'task_2', title: 'Fix navigation bug', status: 'pending', priority: 'medium', dueDate: formatDate(addDays(today, 5)) },
      { id: 'task_6', title: 'Design system tokens', status: 'in_progress', priority: 'urgent', dueDate: formatDate(today) },
    ],
    recentActivity: [
      { id: 'act_1', userId: 'emp_1', userName: 'Employee', action: 'updated task status to In Progress', timestamp: formatDate(today) },
      { id: 'act_2', userId: 'mgr_1', userName: 'Sarah Manager', action: 'added a comment on task', timestamp: formatDate(addDays(today, -1)) },
    ],
  },
  {
    id: 'proj_2',
    name: 'API Integration',
    description: 'Integrate third-party APIs for payment processing and notifications.',
    status: 'active',
    progress: 40,
    startDate: formatDate(addDays(today, -20)),
    endDate: formatDate(addDays(today, 25)),
    managerId: 'mgr_1',
    managerName: 'Sarah Manager',
    members: [
      { id: 'emp_1', name: 'Employee', email: 'employee@foundryone.com', role: 'Developer' },
      { id: 'emp_2', name: 'John Doe', email: 'john@foundryone.com', role: 'Developer' },
    ],
    tasks: [
      { id: 'task_3', title: 'Write unit tests', status: 'completed', priority: 'medium', dueDate: formatDate(addDays(today, -1)) },
      { id: 'task_5', title: 'Update documentation', status: 'pending', priority: 'low', dueDate: formatDate(addDays(today, 7)) },
    ],
    recentActivity: [
      { id: 'act_3', userId: 'emp_1', userName: 'Employee', action: 'completed Write unit tests', timestamp: formatDate(addDays(today, -1)) },
    ],
  },
  {
    id: 'proj_3',
    name: 'Mobile App Update',
    description: 'Release v2.0 of the mobile application with offline support.',
    status: 'active',
    progress: 90,
    startDate: formatDate(addDays(today, -45)),
    endDate: formatDate(addDays(today, 5)),
    managerId: 'mgr_2',
    managerName: 'Mike Manager',
    members: [
      { id: 'emp_1', name: 'Employee', email: 'employee@foundryone.com', role: 'Developer' },
    ],
    tasks: [
      { id: 'task_4', title: 'Review PR #24', status: 'pending', priority: 'low', dueDate: formatDate(addDays(today, 3)) },
    ],
    recentActivity: [
      { id: 'act_4', userId: 'mgr_2', userName: 'Mike Manager', action: 'updated project progress to 90%', timestamp: formatDate(addDays(today, -2)) },
    ],
  },
];

const initialAttendance: Attendance[] = Array.from({ length: 30 }, (_, i) => {
  const date = formatDate(addDays(today, -i));
  const status: Attendance['status'] = i === 0 ? 'present' : i % 7 === 0 ? 'absent' : i % 5 === 0 ? 'late' : 'present';
  const checkIn = status === 'absent' ? null : `${String(8 + (i % 3)).padStart(2, '0')}:${String(15 + (i % 30)).padStart(2, '0')}`;
  const checkOut = status === 'absent' ? null : `${String(17 + (i % 2)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}`;
  const workingHours = checkIn && checkOut ? 8 + (i % 3) * 0.5 : 0;
  return {
    id: `att_${i}`,
    date,
    checkIn,
    checkOut,
    workingHours,
    status,
    notes: status === 'late' ? 'Traffic delay' : undefined,
  };
});

const initialLeaves: Leave[] = [
  {
    id: 'leave_1',
    type: 'casual',
    startDate: formatDate(addDays(today, 10)),
    endDate: formatDate(addDays(today, 12)),
    reason: 'Family function',
    status: 'pending',
    appliedAt: formatDate(today),
  },
  {
    id: 'leave_2',
    type: 'sick',
    startDate: formatDate(addDays(today, -5)),
    endDate: formatDate(addDays(today, -4)),
    reason: 'Fever and cold',
    status: 'approved',
    appliedAt: formatDate(addDays(today, -7)),
    reviewedAt: formatDate(addDays(today, -6)),
    reviewedBy: 'mgr_1',
    reviewerName: 'Sarah Manager',
  },
  {
    id: 'leave_3',
    type: 'annual',
    startDate: formatDate(addDays(today, -20)),
    endDate: formatDate(addDays(today, -15)),
    reason: 'Vacation',
    status: 'approved',
    appliedAt: formatDate(addDays(today, -25)),
    reviewedAt: formatDate(addDays(today, -22)),
    reviewedBy: 'mgr_1',
    reviewerName: 'Sarah Manager',
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'notif_1',
    title: 'Task Assigned',
    message: 'You have been assigned a new task: Complete login module',
    type: 'task',
    read: false,
    createdAt: formatDate(today),
    link: '/employee/tasks/task_1',
  },
  {
    id: 'notif_2',
    title: 'Project Update',
    message: 'Website Redesign progress is now at 75%',
    type: 'project',
    read: false,
    createdAt: formatDate(addDays(today, -1)),
    link: '/employee/projects/proj_1',
  },
  {
    id: 'notif_3',
    title: 'Leave Approved',
    message: 'Your sick leave from 2024-01-10 to 2024-01-11 has been approved',
    type: 'leave',
    read: true,
    createdAt: formatDate(addDays(today, -3)),
  },
  {
    id: 'notif_4',
    title: 'Attendance Reminder',
    message: 'Don\'t forget to check out before leaving',
    type: 'attendance',
    read: true,
    createdAt: formatDate(addDays(today, -1)),
  },
  {
    id: 'notif_5',
    title: 'New Message',
    message: 'Sarah Manager sent you a message regarding PR #24',
    type: 'message',
    read: false,
    createdAt: formatDate(today),
  },
];

const leaveBalances: LeaveBalance[] = [
  { type: 'casual', total: 12, used: 2, remaining: 10 },
  { type: 'sick', total: 10, used: 1, remaining: 9 },
  { type: 'annual', total: 20, used: 5, remaining: 15 },
  { type: 'maternity', total: 180, used: 0, remaining: 180 },
  { type: 'paternity', total: 5, used: 0, remaining: 5 },
  { type: 'unpaid', total: 30, used: 0, remaining: 30 },
];

const employeeProfile: EmployeeProfile = {
  id: 'emp_1',
  name: 'Employee',
  email: 'employee@foundryone.com',
  phone: '+1 234 567 8900',
  department: 'Engineering',
  position: 'Senior Developer',
  joinDate: '2022-03-15',
  address: '123 Main St, City, Country',
  emergencyContact: '+1 234 567 8901',
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
};

let tasks = [...initialTasks];
let projects = [...initialProjects];
let attendance = [...initialAttendance];
let leaves = [...initialLeaves];
let notifications = [...initialNotifications];

const employeeService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay();
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      attendanceThisMonth: attendance.filter(a => new Date(a.date).getMonth() === today.getMonth() && a.status === 'present').length,
      leaveBalance: leaveBalances.reduce((sum, lb) => sum + lb.remaining, 0),
    };
  },

  async getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    await delay();
    let result = [...tasks];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.priority) result = result.filter(t => t.priority === filters.priority);
    if (filters.projectId) result = result.filter(t => t.projectId === filters.projectId);
    if (filters.dueDateFrom) {
      const fromDate = filters.dueDateFrom;
      result = result.filter(t => t.dueDate >= fromDate);
    }
    if (filters.dueDateTo) {
      const toDate = filters.dueDateTo;
      result = result.filter(t => t.dueDate <= toDate);
    }

    const sortKey = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    result = result.slice(start, start + limit);

    return { data: result, total, page, limit, totalPages };
  },

  async getTask(id: string): Promise<Task | null> {
    await delay();
    return tasks.find(t => t.id === id) || null;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    await delay();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    const updated = { ...tasks[index], ...data, updatedAt: formatDate(today) };
    tasks[index] = updated;
    return updated;
  },

  async addTaskComment(taskId: string, text: string, userName: string): Promise<TaskComment> {
    await delay();
    const comment: TaskComment = {
      id: generateId(),
      taskId,
      userId: 'emp_1',
      userName,
      text,
      createdAt: formatDate(today),
    };
    const task = tasks.find(t => t.id === taskId);
    if (task) task.comments.push(comment);
    return comment;
  },

  async getProjects(): Promise<Project[]> {
    await delay();
    return projects;
  },

  async getProject(id: string): Promise<Project | null> {
    await delay();
    return projects.find(p => p.id === id) || null;
  },

  async getAttendance(): Promise<Attendance[]> {
    await delay();
    return attendance;
  },

  async checkIn(): Promise<Attendance> {
    await delay();
    const record: Attendance = {
      id: generateId(),
      date: formatDate(today),
      checkIn: new Date().toTimeString().slice(0, 5),
      checkOut: null,
      workingHours: 0,
      status: 'present',
    };
    attendance.unshift(record);
    return record;
  },

  async checkOut(): Promise<Attendance> {
    await delay();
    const index = attendance.findIndex(a => a.date === formatDate(today) && !a.checkOut);
    if (index === -1) throw new Error('No active check-in found for today');
    const checkOutTime = new Date().toTimeString().slice(0, 5);
    attendance[index].checkOut = checkOutTime;
    const [inH, inM] = (attendance[index].checkIn || '08:00').split(':').map(Number);
    const [outH, outM] = checkOutTime.split(':').map(Number);
    attendance[index].workingHours = Math.round(((outH * 60 + outM) - (inH * 60 + inM)) / 60 * 10) / 10;
    return attendance[index];
  },

  async getLeaveBalance(): Promise<LeaveBalance[]> {
    await delay();
    return leaveBalances;
  },

  async getLeaves(): Promise<Leave[]> {
    await delay();
    return leaves;
  },

  async applyLeave(data: { type: LeaveType; startDate: string; endDate: string; reason: string }): Promise<Leave> {
    await delay();
    const leave: Leave = {
      id: generateId(),
      ...data,
      status: 'pending',
      appliedAt: formatDate(today),
    };
    leaves.unshift(leave);
    return leave;
  },

  async cancelLeave(id: string): Promise<Leave> {
    await delay();
    const leave = leaves.find(l => l.id === id);
    if (!leave) throw new Error('Leave not found');
    if (leave.status !== 'pending') throw new Error('Only pending leaves can be cancelled');
    leave.status = 'cancelled';
    return leave;
  },

  async getNotifications(): Promise<Notification[]> {
    await delay();
    return notifications;
  },

  async markNotificationRead(id: string): Promise<Notification> {
    await delay();
    const notif = notifications.find(n => n.id === id);
    if (!notif) throw new Error('Notification not found');
    notif.read = true;
    return notif;
  },

  async markAllNotificationsRead(): Promise<void> {
    await delay();
    notifications.forEach(n => { n.read = true; });
  },

  async getProfile(): Promise<EmployeeProfile> {
    await delay();
    return employeeProfile;
  },

  async updateProfile(data: Partial<EmployeeProfile>): Promise<EmployeeProfile> {
    await delay();
    Object.assign(employeeProfile, data);
    return { ...employeeProfile };
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    await delay();
    if (!currentPassword || !newPassword) throw new Error('Both passwords are required');
    if (newPassword.length < 8) throw new Error('Password must be at least 8 characters');
    return { success: true };
  },
};

export default employeeService;
