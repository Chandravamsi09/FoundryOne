export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  CLIENT: 'client',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.CLIENT]: 'Client',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'System administration',
  [ROLES.EMPLOYEE]: 'Work and tasks',
  [ROLES.MANAGER]: 'Team and projects',
  [ROLES.CLIENT]: 'Projects and services',
};

export const ROLE_ICONS = {
  [ROLES.ADMIN]: '⚙️',
  [ROLES.EMPLOYEE]: '💼',
  [ROLES.MANAGER]: '📊',
  [ROLES.CLIENT]: '🤝',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  EMPLOYEE_LOGIN: '/employee/login',
  EMPLOYEE_DASHBOARD: '/employee/dashboard',
  MANAGER_LOGIN: '/manager/login',
  MANAGER_DASHBOARD: '/manager/dashboard',
  CLIENT_LOGIN: '/client/login',
  CLIENT_DASHBOARD: '/client/dashboard',
};

export const AUTH_STORAGE_KEY = 'foundryone_auth';
export const TOKEN_KEY = 'foundryone_token';
export const USER_KEY = 'foundryone_user';
export const ROLE_KEY = 'foundryone_role';

export const APP_NAME = 'FoundryOne';
export const APP_TAGLINE = 'Build. Manage. Deliver.';

export const PASSWORD_MIN_LENGTH = 8;

export const DEMO_ACCOUNTS = {
  [ROLES.ADMIN]: { email: 'admin@foundryone.com', password: 'Admin@123' },
  [ROLES.EMPLOYEE]: { email: 'employee@foundryone.com', password: 'Employee@123' },
  [ROLES.MANAGER]: { email: 'manager@foundryone.com', password: 'Manager@123' },
  [ROLES.CLIENT]: { email: 'client@foundryone.com', password: 'Client@123' },
};