import api from './api';
import { TOKEN_KEY, USER_KEY, ROLE_KEY, AUTH_STORAGE_KEY } from '../types/constants';

const persistAuth = (token: string, user: any, role: string) => {
  const data = { token, user, role };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ROLE_KEY, role);
};

const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface AuthResult {
  token: string;
  user: any;
  role: string;
}

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const response = await api.post('/auth/login', credentials);
    const { access_token, user, role } = response.data;
    persistAuth(access_token, user, role);
    return { token: access_token, user, role };
  },

  async register(data: RegisterData): Promise<{ user: any; role: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<boolean> {
    // Optionally call a backend endpoint to invalidate the token
    clearAuth();
    return true;
  },

  async checkAuth(): Promise<AuthResult | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      const role = user.role;
      // Re-persist in case it changed
      persistAuth(token, user, role);
      return { token, user, role };
    } catch (error) {
      clearAuth();
      return null;
    }
  },

  async changePassword({ email, currentPassword, newPassword }: { email: string; currentPassword: string; newPassword: string }) {
    const response = await api.post('/auth/change-password', { email, currentPassword, newPassword });
    return response.data;
  },
};

export default authService;