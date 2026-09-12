import api from './api';
import { TOKEN_KEY, USER_KEY, ROLE_KEY, AUTH_STORAGE_KEY, DEMO_ACCOUNTS, ROLES } from '../types/constants';

const REGISTERED_USERS_KEY = 'foundryone_registered_users';

function getRegisteredUsers(): any[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: any[]): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered users:', e);
  }
}

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
    const normalizedEmail = (credentials.email || '').trim().toLowerCase();
    const selectedRole = (credentials.role || '').toLowerCase();

    // 1. Check demo accounts first
    const demo = DEMO_ACCOUNTS[selectedRole as keyof typeof DEMO_ACCOUNTS];
    if (demo && demo.email.toLowerCase() === normalizedEmail && demo.password === credentials.password) {
      const user = {
        id: `usr_demo_${selectedRole}`,
        email: normalizedEmail,
        name: selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1),
        role: selectedRole,
      };
      const token = `mock_token_${selectedRole}_${Date.now()}`;
      persistAuth(token, user, selectedRole);
      return { token, user, role: selectedRole };
    }

    // 2. Check locally registered users
    const users = getRegisteredUsers();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === normalizedEmail &&
        u.password === credentials.password &&
        u.role.toLowerCase() === selectedRole
    );

    if (match) {
      const user = {
        id: match.id,
        email: match.email,
        name: match.name,
        role: match.role,
        phone: match.phone,
      };
      const token = `mock_token_${match.role}_${Date.now()}`;
      persistAuth(token, user, match.role);
      return { token, user, role: match.role };
    }

    // 3. Try backend API if running
    try {
      const response = await api.post('/auth/login', {
        ...credentials,
        email: normalizedEmail,
      });
      const { access_token, user, role } = response.data;
      persistAuth(access_token, user, role);
      return { token: access_token, user, role };
    } catch (apiError: any) {
      if (apiError.response && apiError.response.status === 401) {
        throw new Error(apiError.response.data?.detail || 'Invalid email or password for the selected role.');
      }
      throw new Error('Invalid email or password for the selected role.');
    }
  },

  async register(data: RegisterData): Promise<{ user: any; role: string }> {
    const normalizedEmail = (data.email || '').trim().toLowerCase();
    const selectedRole = (data.role || '').toLowerCase();

    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Always register user locally so local/offline flow is 100% resilient
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

    const newUser = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: normalizedEmail,
      phone: data.phone,
      password: data.password,
      role: selectedRole,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      users[existingIndex] = newUser;
    } else {
      users.push(newUser);
    }
    saveRegisteredUsers(users);

    // Try backend if active, ignore connection failures
    try {
      const response = await api.post('/auth/register', {
        ...data,
        email: normalizedEmail,
      });
      if (response.data?.user) {
        return { user: response.data.user, role: response.data.role || selectedRole };
      }
    } catch (e: any) {
      if (
        e.response &&
        e.response.status === 400 &&
        e.response.data?.detail &&
        e.response.data.detail !== 'Email already registered'
      ) {
        throw new Error(e.response.data.detail);
      }
    }

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      role: selectedRole,
    };
  },

  async logout(): Promise<boolean> {
    clearAuth();
    return true;
  },

  async checkAuth(): Promise<AuthResult | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const role = localStorage.getItem(ROLE_KEY);

    if (!token || !userRaw || !role) return null;

    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      const r = user.role || role;
      persistAuth(token, user, r);
      return { token, user, role: r };
    } catch {
      try {
        const user = JSON.parse(userRaw);
        return { token, user, role };
      } catch {
        clearAuth();
        return null;
      }
    }
  },

  async changePassword({ email, currentPassword, newPassword }: { email: string; currentPassword: string; newPassword: string }) {
    try {
      const response = await api.post('/auth/change-password', { email, currentPassword, newPassword });
      return response.data;
    } catch {
      const users = getRegisteredUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === currentPassword);
      if (user) {
        user.password = newPassword;
        saveRegisteredUsers(users);
        return { success: true };
      }
      throw new Error('Current password is incorrect.');
    }
  },
};

export default authService;
