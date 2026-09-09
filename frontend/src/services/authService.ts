import { ROLES, DEMO_ACCOUNTS, TOKEN_KEY, USER_KEY, ROLE_KEY, AUTH_STORAGE_KEY } from '../types/constants';

const registeredUsers = new Map<string, any>();

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

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

const normalizeRole = (role: string) => (role || '').toLowerCase();

const findRegisteredUser = (email: string) => registeredUsers.get(email.toLowerCase());

const buildUserPayload = (role: string, email: string) => ({
  id: `usr_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
  email,
  role,
  name: email.split('@')[0],
  createdAt: new Date().toISOString(),
});

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
  async login({ email, password, role }: LoginCredentials): Promise<AuthResult> {
    await delay();
    const selectedRole = normalizeRole(role);
    const normalizedEmail = (email || '').toLowerCase();

    const demo = DEMO_ACCOUNTS[selectedRole as keyof typeof DEMO_ACCOUNTS];
    if (demo && demo.email === normalizedEmail && demo.password === password) {
      const user = buildUserPayload(selectedRole, normalizedEmail);
      const token = `mock_token_${selectedRole}_${Date.now()}`;
      persistAuth(token, user, selectedRole);
      return { token, user, role: selectedRole };
    }

    const registered = findRegisteredUser(normalizedEmail);
    if (registered && registered.password === password && normalizeRole(registered.role) === selectedRole) {
      const user = {
        id: registered.id,
        email: registered.email,
        role: registered.role,
        name: registered.name,
        phone: registered.phone,
        createdAt: registered.createdAt,
      };
      const token = `mock_token_${selectedRole}_${Date.now()}`;
      persistAuth(token, user, selectedRole);
      return { token, user, role: selectedRole };
    }

    throw new Error('Invalid credentials for the selected role.');
  },

  async register(data: RegisterData): Promise<{ user: any; role: string }> {
    await delay();
    const selectedRole = normalizeRole(data.role);
    const normalizedEmail = (data.email || '').toLowerCase();

    if (selectedRole === ROLES.ADMIN) {
      throw new Error('Admin accounts cannot be created through public registration.');
    }
    if (![ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.CLIENT].includes(selectedRole as any)) {
      throw new Error('Invalid role selected.');
    }
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    if (findRegisteredUser(normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const user = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: normalizedEmail,
      phone: data.phone,
      role: selectedRole,
      createdAt: new Date().toISOString(),
    };
    registeredUsers.set(normalizedEmail, { ...user, password: data.password });
    return { user, role: selectedRole };
  },

  async logout(): Promise<boolean> {
    await delay(200);
    clearAuth();
    return true;
  },

  async checkAuth(): Promise<AuthResult | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const role = localStorage.getItem(ROLE_KEY);
    if (!token || !userRaw || !role) return null;
    try {
      const user = JSON.parse(userRaw);
      return { token, user, role: normalizeRole(role) };
    } catch {
      return null;
    }
  },

  async changePassword({ email, currentPassword, newPassword }: { email: string; currentPassword: string; newPassword: string }) {
    await delay();
    const demo = Object.values(DEMO_ACCOUNTS).find((d) => d.email === email.toLowerCase());
    if (demo && demo.password === currentPassword) return { success: true };
    const registered = findRegisteredUser(email.toLowerCase());
    if (registered && registered.password === currentPassword) {
      registered.password = newPassword;
      return { success: true };
    }
    throw new Error('Current password is incorrect.');
  },
};

export default authService;