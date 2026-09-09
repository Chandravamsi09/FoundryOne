export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'manager' | 'client';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  phone?: string;
  organization?: string;
}

export interface AdminOrganization {
  id: string;
  name: string;
  industry: string;
  size: string;
  status: 'active' | 'inactive';
  memberCount: number;
  projectCount: number;
  createdAt: string;
}

export interface AdminProject {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  progress: number;
  owner: string;
  team: string[];
  deadline: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface AdminSettings {
  general: { appName: string; tagline: string; supportEmail: string };
  security: { mfaEnabled: boolean; sessionTimeout: number; passwordPolicy: string };
  roles: Record<string, string[]>;
  notifications: { emailAlerts: boolean; pushNotifications: boolean; weeklyDigest: boolean };
}

export interface AdminStats {
  totalUsers: number;
  totalEmployees: number;
  totalManagers: number;
  totalClients: number;
  activeProjects: number;
  completedProjects: number;
  pendingApprovals: number;
  systemHealth: { cpu: number; memory: number; storage: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportFilter {
  type: 'users' | 'projects' | 'organizations' | 'activity';
  dateFrom: string;
  dateTo: string;
  role?: string;
  status?: string;
}
