import api from './api';
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

const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getUsers(params: { page?: number; limit?: number; search?: string; role?: string; status?: string } = {}): Promise<PaginatedResponse<AdminUser>> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async getUser(id: string): Promise<AdminUser | undefined> {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  async createUser(data: Partial<AdminUser>): Promise<AdminUser> {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async toggleUserStatus(id: string): Promise<AdminUser> {
    const response = await api.patch(`/admin/users/${id}/status`);
    return response.data;
  },

  async getOrganizations(): Promise<AdminOrganization[]> {
    const response = await api.get('/admin/organizations');
    return response.data;
  },

  async getOrganization(id: string): Promise<AdminOrganization | undefined> {
    const response = await api.get(`/admin/organizations/${id}`);
    return response.data;
  },

  async createOrganization(data: Partial<AdminOrganization>): Promise<AdminOrganization> {
    const response = await api.post('/admin/organizations', data);
    return response.data;
  },

  async updateOrganization(id: string, data: Partial<AdminOrganization>): Promise<AdminOrganization> {
    const response = await api.patch(`/admin/organizations/${id}`, data);
    return response.data;
  },

  async deleteOrganization(id: string): Promise<void> {
    await api.delete(`/admin/organizations/${id}`);
  },

  async getProjects(params: { status?: string; search?: string } = {}): Promise<AdminProject[]> {
    const response = await api.get('/admin/projects', { params });
    return response.data;
  },

  async getProject(id: string): Promise<AdminProject | undefined> {
    const response = await api.get(`/admin/projects/${id}`);
    return response.data;
  },

  async updateProject(id: string, data: Partial<AdminProject>): Promise<AdminProject> {
    const response = await api.patch(`/admin/projects/${id}`, data);
    return response.data;
  },

  async getReports(filter: ReportFilter): Promise<any[]> {
    const response = await api.get('/admin/reports', { params: filter });
    return response.data;
  },

  async getAnalytics(): Promise<any> {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  async getSettings(): Promise<AdminSettings> {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings> {
    const response = await api.patch('/admin/settings', data);
    return response.data;
  },

  async getAuditLogs(params: { page?: number; limit?: number; action?: string; actor?: string } = {}): Promise<PaginatedResponse<AdminAuditLog>> {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },
};

export default adminService;
