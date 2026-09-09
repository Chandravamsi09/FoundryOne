import {
  AdminUser,
  AdminOrganization,
  AdminProject,
  AdminAuditLog,
  AdminSettings,
  AdminStats,
  PaginatedResponse,
  ReportFilter,
} from '../types/admin';

const delay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

let users: AdminUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@foundryone.com', role: 'admin', status: 'active', createdAt: daysAgo(90), updatedAt: daysAgo(1), phone: '+1-555-0100', organization: 'FoundryOne' },
  { id: '2', name: 'Alice Johnson', email: 'alice@example.com', role: 'employee', status: 'active', createdAt: daysAgo(60), updatedAt: daysAgo(2), phone: '+1-555-0101', organization: 'Acme Corp' },
  { id: '3', name: 'Bob Smith', email: 'bob@example.com', role: 'manager', status: 'active', createdAt: daysAgo(45), updatedAt: daysAgo(3), phone: '+1-555-0102', organization: 'Acme Corp' },
  { id: '4', name: 'Charlie Davis', email: 'charlie@example.com', role: 'client', status: 'inactive', createdAt: daysAgo(30), updatedAt: daysAgo(5), phone: '+1-555-0103', organization: 'Globex' },
  { id: '5', name: 'Diana Evans', email: 'diana@example.com', role: 'employee', status: 'active', createdAt: daysAgo(20), updatedAt: daysAgo(4), phone: '+1-555-0104', organization: 'Initech' },
  { id: '6', name: 'Evan Wright', email: 'evan@example.com', role: 'manager', status: 'active', createdAt: daysAgo(15), updatedAt: daysAgo(6), phone: '+1-555-0105', organization: 'Initech' },
  { id: '7', name: 'Fiona Green', email: 'fiona@example.com', role: 'client', status: 'active', createdAt: daysAgo(10), updatedAt: daysAgo(7), phone: '+1-555-0106', organization: 'Globex' },
  { id: '8', name: 'George King', email: 'george@example.com', role: 'employee', status: 'inactive', createdAt: daysAgo(5), updatedAt: daysAgo(8), phone: '+1-555-0107', organization: 'FoundryOne' },
];

let organizations: AdminOrganization[] = [
  { id: '1', name: 'FoundryOne', industry: 'Technology', size: '51-200', status: 'active', memberCount: 12, projectCount: 8, createdAt: daysAgo(120) },
  { id: '2', name: 'Acme Corp', industry: 'Manufacturing', size: '201-500', status: 'active', memberCount: 45, projectCount: 12, createdAt: daysAgo(90) },
  { id: '3', name: 'Globex', industry: 'Finance', size: '1001-5000', status: 'active', memberCount: 120, projectCount: 25, createdAt: daysAgo(80) },
  { id: '4', name: 'Initech', industry: 'Consulting', size: '11-50', status: 'inactive', memberCount: 8, projectCount: 3, createdAt: daysAgo(40) },
];

let projects: AdminProject[] = [
  { id: '1', name: 'Website Redesign', description: 'Revamp company website', status: 'active', progress: 65, owner: 'Bob Smith', team: ['Alice Johnson', 'Evan Wright'], deadline: daysAgo(-10), createdAt: daysAgo(30) },
  { id: '2', name: 'Mobile App', description: 'iOS and Android app', status: 'active', progress: 40, owner: 'Evan Wright', team: ['Alice Johnson', 'Diana Evans'], deadline: daysAgo(-30), createdAt: daysAgo(25) },
  { id: '3', name: 'Data Migration', description: 'Move legacy data to cloud', status: 'completed', progress: 100, owner: 'Bob Smith', team: ['George King'], deadline: daysAgo(-5), createdAt: daysAgo(60) },
  { id: '4', name: 'Security Audit', description: 'Annual security review', status: 'planning', progress: 10, owner: 'Alice Johnson', team: ['Fiona Green'], deadline: daysAgo(-20), createdAt: daysAgo(5) },
];

let auditLogs: AdminAuditLog[] = [
  { id: '1', action: 'User Created', actor: 'Admin User', target: 'Alice Johnson', timestamp: daysAgo(0.01), details: 'Created employee account' },
  { id: '2', action: 'Project Updated', actor: 'Bob Smith', target: 'Website Redesign', timestamp: daysAgo(0.05), details: 'Updated progress to 65%' },
  { id: '3', action: 'Role Changed', actor: 'Admin User', target: 'Evan Wright', timestamp: daysAgo(0.1), details: 'Changed from Employee to Manager' },
  { id: '4', action: 'Login', actor: 'Diana Evans', target: 'System', timestamp: daysAgo(0.15), details: 'Successful login from 192.168.1.1' },
  { id: '5', action: 'Organization Created', actor: 'Admin User', target: 'Initech', timestamp: daysAgo(0.2), details: 'Created new organization' },
  { id: '6', action: 'User Deactivated', actor: 'Admin User', target: 'George King', timestamp: daysAgo(0.25), details: 'Deactivated employee account' },
  { id: '7', action: 'Settings Updated', actor: 'Admin User', target: 'System', timestamp: daysAgo(0.3), details: 'Updated security settings' },
  { id: '8', action: 'Project Completed', actor: 'Bob Smith', target: 'Data Migration', timestamp: daysAgo(0.35), details: 'Marked project as completed' },
];

let settings: AdminSettings = {
  general: { appName: 'FoundryOne', tagline: 'Build. Manage. Deliver.', supportEmail: 'support@foundryone.com' },
  security: { mfaEnabled: true, sessionTimeout: 30, passwordPolicy: 'strong' },
  roles: { admin: ['*'], employee: ['projects.view', 'tasks.view'], manager: ['projects.manage', 'reports.view'], client: ['projects.view', 'invoices.view'] },
  notifications: { emailAlerts: true, pushNotifications: false, weeklyDigest: true },
};

const adminService = {
  async getStats(): Promise<AdminStats> {
    await delay(300);
    return {
      totalUsers: users.length,
      totalEmployees: users.filter((u) => u.role === 'employee').length,
      totalManagers: users.filter((u) => u.role === 'manager').length,
      totalClients: users.filter((u) => u.role === 'client').length,
      activeProjects: projects.filter((p) => p.status === 'active').length,
      completedProjects: projects.filter((p) => p.status === 'completed').length,
      pendingApprovals: 3,
      systemHealth: { cpu: 42, memory: 68, storage: 31 },
    };
  },

  async getUsers(params: { page?: number; limit?: number; search?: string; role?: string; status?: string } = {}): Promise<PaginatedResponse<AdminUser>> {
    await delay(300);
    let filtered = [...users];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (params.role) filtered = filtered.filter((u) => u.role === params.role);
    if (params.status) filtered = filtered.filter((u) => u.status === params.status);

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) };
  },

  async getUser(id: string): Promise<AdminUser | undefined> {
    await delay(200);
    return users.find((u) => u.id === id);
  },

  async createUser(data: Partial<AdminUser>): Promise<AdminUser> {
    await delay(300);
    const newUser: AdminUser = {
      id: String(Date.now()),
      name: data.name || 'New User',
      email: data.email || 'new@example.com',
      role: data.role || 'employee',
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phone: data.phone,
      organization: data.organization,
    };
    users.push(newUser);
    return newUser;
  },

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    await delay(300);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');
    users[idx] = { ...users[idx], ...data, updatedAt: new Date().toISOString() };
    return users[idx];
  },

  async deleteUser(id: string): Promise<void> {
    await delay(300);
    users = users.filter((u) => u.id !== id);
  },

  async toggleUserStatus(id: string): Promise<AdminUser> {
    await delay(200);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');
    users[idx].status = users[idx].status === 'active' ? 'inactive' : 'active';
    users[idx].updatedAt = new Date().toISOString();
    return users[idx];
  },

  async getOrganizations(): Promise<AdminOrganization[]> {
    await delay(300);
    return [...organizations];
  },

  async getOrganization(id: string): Promise<AdminOrganization | undefined> {
    await delay(200);
    return organizations.find((o) => o.id === id);
  },

  async createOrganization(data: Partial<AdminOrganization>): Promise<AdminOrganization> {
    await delay(300);
    const org: AdminOrganization = {
      id: String(Date.now()),
      name: data.name || 'New Org',
      industry: data.industry || 'Other',
      size: data.size || '1-10',
      status: data.status || 'active',
      memberCount: 0,
      projectCount: 0,
      createdAt: new Date().toISOString(),
    };
    organizations.push(org);
    return org;
  },

  async updateOrganization(id: string, data: Partial<AdminOrganization>): Promise<AdminOrganization> {
    await delay(300);
    const idx = organizations.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Organization not found');
    organizations[idx] = { ...organizations[idx], ...data };
    return organizations[idx];
  },

  async deleteOrganization(id: string): Promise<void> {
    await delay(300);
    organizations = organizations.filter((o) => o.id !== id);
  },

  async getProjects(params: { status?: string; search?: string } = {}): Promise<AdminProject[]> {
    await delay(300);
    let filtered = [...projects];
    if (params.status) filtered = filtered.filter((p) => p.status === params.status);
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q));
    }
    return filtered;
  },

  async getProject(id: string): Promise<AdminProject | undefined> {
    await delay(200);
    return projects.find((p) => p.id === id);
  },

  async updateProject(id: string, data: Partial<AdminProject>): Promise<AdminProject> {
    await delay(300);
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Project not found');
    projects[idx] = { ...projects[idx], ...data };
    return projects[idx];
  },

  async getReports(filter: ReportFilter): Promise<any[]> {
    await delay(400);
    const reportType = filter.type;
    if (reportType === 'users') {
      return [
        { label: 'New Users', value: users.filter((u) => new Date(u.createdAt) >= new Date(filter.dateFrom)).length, change: '+12%' },
        { label: 'Active Users', value: users.filter((u) => u.status === 'active').length, change: '+5%' },
        { label: 'Inactive Users', value: users.filter((u) => u.status === 'inactive').length, change: '-2%' },
      ];
    }
    if (reportType === 'projects') {
      return [
        { label: 'Total Projects', value: projects.length, change: '+8%' },
        { label: 'Completed', value: projects.filter((p) => p.status === 'completed').length, change: '+15%' },
        { label: 'Active', value: projects.filter((p) => p.status === 'active').length, change: '+3%' },
      ];
    }
    if (reportType === 'organizations') {
      return [
        { label: 'Total Orgs', value: organizations.length, change: '+2%' },
        { label: 'Active Orgs', value: organizations.filter((o) => o.status === 'active').length, change: '0%' },
        { label: 'Avg Projects', value: Math.round(organizations.reduce((a, b) => a + b.projectCount, 0) / organizations.length), change: '+1%' },
      ];
    }
    return [
      { label: 'Total Events', value: auditLogs.length, change: '+24%' },
      { label: 'Logins', value: auditLogs.filter((l) => l.action === 'Login').length, change: '+10%' },
      { label: 'Changes', value: auditLogs.filter((l) => l.action !== 'Login').length, change: '+5%' },
    ];
  },

  async getAnalytics(): Promise<any> {
    await delay(400);
    return {
      userGrowth: [
        { month: 'Jan', users: 120 },
        { month: 'Feb', users: 150 },
        { month: 'Mar', users: 180 },
        { month: 'Apr', users: 220 },
        { month: 'May', users: 260 },
        { month: 'Jun', users: 300 },
      ],
      roleDistribution: [
        { role: 'Admin', count: users.filter((u) => u.role === 'admin').length },
        { role: 'Employee', count: users.filter((u) => u.role === 'employee').length },
        { role: 'Manager', count: users.filter((u) => u.role === 'manager').length },
        { role: 'Client', count: users.filter((u) => u.role === 'client').length },
      ],
      completionRate: 78,
      projectStats: [
        { status: 'Active', count: projects.filter((p) => p.status === 'active').length },
        { status: 'Completed', count: projects.filter((p) => p.status === 'completed').length },
        { status: 'Planning', count: projects.filter((p) => p.status === 'planning').length },
        { status: 'On Hold', count: projects.filter((p) => p.status === 'on_hold').length },
      ],
    };
  },

  async getSettings(): Promise<AdminSettings> {
    await delay(300);
    return { ...settings };
  },

  async updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings> {
    await delay(300);
    settings = { ...settings, ...data };
    return { ...settings };
  },

  async getAuditLogs(params: { page?: number; limit?: number; action?: string; actor?: string } = {}): Promise<PaginatedResponse<AdminAuditLog>> {
    await delay(300);
    let filtered = [...auditLogs];
    if (params.action) filtered = filtered.filter((l) => l.action === params.action);
    if (params.actor) filtered = filtered.filter((l) => l.actor === params.actor);

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) };
  },
};

export default adminService;
