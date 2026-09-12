export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  CLIENT: 'client',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.CLIENT]: 'Client',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [ROLES.ADMIN]: 'System Administration',
  [ROLES.EMPLOYEE]: 'Daily Tasks & Projects',
  [ROLES.MANAGER]: 'Team & Approvals',
  [ROLES.CLIENT]: 'Contracts & Invoices',
};

export const ROLE_FEATURES: Record<Role, string[]> = {
  [ROLES.ADMIN]: ['Settings', 'Users', 'Security', 'Analytics'],
  [ROLES.EMPLOYEE]: ['Daily Tasks', 'Attendance', 'Projects', 'Leave'],
  [ROLES.MANAGER]: ['Team Management', 'Reports', 'Analytics', 'Approvals'],
  [ROLES.CLIENT]: ['Projects', 'Contracts', 'Invoices', 'Support'],
};

export const ROLE_GRADIENTS: Record<Role, string> = {
  [ROLES.ADMIN]: 'from-slate-700 via-slate-600 to-blue-600',
  [ROLES.EMPLOYEE]: 'from-blue-600 via-indigo-500 to-purple-600',
  [ROLES.MANAGER]: 'from-emerald-600 via-teal-500 to-cyan-600',
  [ROLES.CLIENT]: 'from-amber-500 via-orange-500 to-rose-500',
};

export const ROUTES = {
  HOME: '/',
  LANDING: '/role-selection',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/login/admin',
  EMPLOYEE_LOGIN: '/login/employee',
  MANAGER_LOGIN: '/login/manager',
  CLIENT_LOGIN: '/login/client',
  ADMIN_DASHBOARD: '/admin/dashboard',
  EMPLOYEE_DASHBOARD: '/employee/dashboard',
  MANAGER_DASHBOARD: '/manager/dashboard',
  CLIENT_DASHBOARD: '/client/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_ORGANIZATIONS: '/admin/organizations',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  EMPLOYEE_TASKS: '/employee/tasks',
  EMPLOYEE_TASK_DETAILS: '/employee/tasks/:id',
  EMPLOYEE_PROJECTS: '/employee/projects',
  EMPLOYEE_PROJECT_DETAILS: '/employee/projects/:id',
  EMPLOYEE_ATTENDANCE: '/employee/attendance',
  EMPLOYEE_LEAVE: '/employee/leave',
  EMPLOYEE_NOTIFICATIONS: '/employee/notifications',
  EMPLOYEE_PROFILE: '/employee/profile',
  MANAGER_TEAM: '/manager/team',
  MANAGER_TEAM_MEMBER: '/manager/team/:id',
  MANAGER_PROJECTS: '/manager/projects',
  MANAGER_PROJECTS_CREATE: '/manager/projects/create',
  MANAGER_PROJECT_DETAILS: '/manager/projects/:id',
  MANAGER_TASKS: '/manager/tasks',
  MANAGER_TASK_DETAILS: '/manager/tasks/:id',
  MANAGER_APPROVALS: '/manager/approvals',
  MANAGER_REPORTS: '/manager/reports',
  MANAGER_ANALYTICS: '/manager/analytics',
} as const;

export const ROLE_LOGIN_ROUTES: Record<Role, string> = {
  [ROLES.ADMIN]: ROUTES.ADMIN_LOGIN,
  [ROLES.EMPLOYEE]: ROUTES.EMPLOYEE_LOGIN,
  [ROLES.MANAGER]: ROUTES.MANAGER_LOGIN,
  [ROLES.CLIENT]: ROUTES.CLIENT_LOGIN,
};

export const AUTH_STORAGE_KEY = 'foundryone_auth';
export const TOKEN_KEY = 'foundryone_token';
export const USER_KEY = 'foundryone_user';
export const ROLE_KEY = 'foundryone_role';

export const APP_NAME = 'FoundryOne';
export const APP_TAGLINE = 'Build. Manage. Deliver.';

export const DEMO_ACCOUNTS = {
  [ROLES.ADMIN]: { email: 'admin@foundryone.com', password: 'Admin@123' },
  [ROLES.EMPLOYEE]: { email: 'employee@foundryone.com', password: 'Employee@123' },
  [ROLES.MANAGER]: { email: 'manager@foundryone.com', password: 'Manager@123' },
  [ROLES.CLIENT]: { email: 'client@foundryone.com', password: 'Client@123' },
} as const;

export const PASSWORD_MIN_LENGTH = 8;
