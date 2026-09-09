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
  CLIENT_PROJECTS: '/client/projects',
  CLIENT_PROJECT_DETAIL: '/client/projects/:id',
  CLIENT_CONTRACTS: '/client/contracts',
  CLIENT_CONTRACT_DETAIL: '/client/contracts/:id',
  CLIENT_INVOICES: '/client/invoices',
  CLIENT_INVOICE_DETAIL: '/client/invoices/:id',
  CLIENT_PAYMENTS: '/client/payments',
  CLIENT_SUPPORT: '/client/support',
  CLIENT_SUPPORT_CREATE: '/client/support/create',
  CLIENT_SUPPORT_DETAIL: '/client/support/:id',
  CLIENT_PROFILE: '/client/profile',
  CLIENT_NOTIFICATIONS: '/client/notifications',
} as const;

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [PROJECT_STATUS.PLANNING]: 'Planning',
  [PROJECT_STATUS.IN_PROGRESS]: 'In Progress',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.CANCELLED]: 'Cancelled',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [PROJECT_STATUS.PLANNING]: 'bg-slate-100 text-slate-700',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
  [PROJECT_STATUS.ON_HOLD]: 'bg-amber-100 text-amber-700',
  [PROJECT_STATUS.COMPLETED]: 'bg-green-100 text-green-700',
  [PROJECT_STATUS.CANCELLED]: 'bg-red-100 text-red-700',
};

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  [INVOICE_STATUS.DRAFT]: 'Draft',
  [INVOICE_STATUS.SENT]: 'Sent',
  [INVOICE_STATUS.PAID]: 'Paid',
  [INVOICE_STATUS.OVERDUE]: 'Overdue',
  [INVOICE_STATUS.CANCELLED]: 'Cancelled',
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  [INVOICE_STATUS.DRAFT]: 'bg-slate-100 text-slate-700',
  [INVOICE_STATUS.SENT]: 'bg-blue-100 text-blue-700',
  [INVOICE_STATUS.PAID]: 'bg-green-100 text-green-700',
  [INVOICE_STATUS.OVERDUE]: 'bg-red-100 text-red-700',
  [INVOICE_STATUS.CANCELLED]: 'bg-gray-100 text-gray-700',
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type TicketPriority = (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY];

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  [TICKET_PRIORITY.LOW]: 'Low',
  [TICKET_PRIORITY.MEDIUM]: 'Medium',
  [TICKET_PRIORITY.HIGH]: 'High',
  [TICKET_PRIORITY.CRITICAL]: 'Critical',
};

export const TICKET_PRIORITY_COLORS: Record<TicketPriority, string> = {
  [TICKET_PRIORITY.LOW]: 'bg-slate-100 text-slate-700',
  [TICKET_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-700',
  [TICKET_PRIORITY.HIGH]: 'bg-amber-100 text-amber-700',
  [TICKET_PRIORITY.CRITICAL]: 'bg-red-100 text-red-700',
};

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TICKET_STATUS.OPEN]: 'Open',
  [TICKET_STATUS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS.RESOLVED]: 'Resolved',
  [TICKET_STATUS.CLOSED]: 'Closed',
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  [TICKET_STATUS.OPEN]: 'bg-red-100 text-red-700',
  [TICKET_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
  [TICKET_STATUS.RESOLVED]: 'bg-green-100 text-green-700',
  [TICKET_STATUS.CLOSED]: 'bg-slate-100 text-slate-700',
};

export const TICKET_CATEGORIES = [
  'Technical Issue',
  'Billing',
  'Feature Request',
  'General Inquiry',
  'Account Access',
  'Documentation',
] as const;

export const PAYMENT_METHODS = [
  'Bank Transfer',
  'Credit Card',
  'PayPal',
  'Check',
  'Wire Transfer',
] as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.PROCESSING]: 'Processing',
  [PAYMENT_STATUS.COMPLETED]: 'Completed',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.PENDING]: 'bg-amber-100 text-amber-700',
  [PAYMENT_STATUS.PROCESSING]: 'bg-blue-100 text-blue-700',
  [PAYMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-700',
  [PAYMENT_STATUS.FAILED]: 'bg-red-100 text-red-700',
  [PAYMENT_STATUS.REFUNDED]: 'bg-slate-100 text-slate-700',
};

export const CONTRACT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  PENDING_REVIEW: 'pending_review',
} as const;

export type ContractStatus = (typeof CONTRACT_STATUS)[keyof typeof CONTRACT_STATUS];

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  [CONTRACT_STATUS.DRAFT]: 'Draft',
  [CONTRACT_STATUS.ACTIVE]: 'Active',
  [CONTRACT_STATUS.EXPIRED]: 'Expired',
  [CONTRACT_STATUS.TERMINATED]: 'Terminated',
  [CONTRACT_STATUS.PENDING_REVIEW]: 'Pending Review',
};

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  [CONTRACT_STATUS.DRAFT]: 'bg-slate-100 text-slate-700',
  [CONTRACT_STATUS.ACTIVE]: 'bg-green-100 text-green-700',
  [CONTRACT_STATUS.EXPIRED]: 'bg-amber-100 text-amber-700',
  [CONTRACT_STATUS.TERMINATED]: 'bg-red-100 text-red-700',
  [CONTRACT_STATUS.PENDING_REVIEW]: 'bg-blue-100 text-blue-700',
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  [NOTIFICATION_TYPES.INFO]: 'Info',
  [NOTIFICATION_TYPES.SUCCESS]: 'Success',
  [NOTIFICATION_TYPES.WARNING]: 'Warning',
  [NOTIFICATION_TYPES.ERROR]: 'Error',
};

export const NOTIFICATION_TYPE_COLORS: Record<NotificationType, string> = {
  [NOTIFICATION_TYPES.INFO]: 'bg-blue-100 text-blue-700',
  [NOTIFICATION_TYPES.SUCCESS]: 'bg-green-100 text-green-700',
  [NOTIFICATION_TYPES.WARNING]: 'bg-amber-100 text-amber-700',
  [NOTIFICATION_TYPES.ERROR]: 'bg-red-100 text-red-700',
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