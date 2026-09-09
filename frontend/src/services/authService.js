import {
  ROLES,
  DEMO_ACCOUNTS,
  TOKEN_KEY,
  USER_KEY,
  ROLE_KEY,
  AUTH_STORAGE_KEY,
} from '../utils/constants';

// Mock users database for registration
const registeredUsers = new Map();

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateNetworkError = () => {
  if (import.meta.env.VITE_MOCK_ERROR === 'true') {
    throw new Error('Unable to connect to the server. Please try again.');
  }
};

const buildUserPayload = (role, email) => ({
  id: `usr_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
  email,
  role,
  name: email.split('@')[0],
  createdAt: new Date().toISOString(),
});

const persistAuth = (token, user, role) => {
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

const normalizeRole = (role) => (role || '').toLowerCase();

const findRegisteredUser = (email) => registeredUsers.get(email.toLowerCase());

export const authService = {
  async login({ email, password, role }) {
    await delay();
    simulateNetworkError();

    const selectedRole = normalizeRole(role);
    const normalizedEmail = (email || '').toLowerCase();

    // Check demo accounts first
    const demo = DEMO_ACCOUNTS[selectedRole];
    if (demo && demo.email === normalizedEmail && demo.password === password) {
      const user = buildUserPayload(selectedRole, normalizedEmail);
      const token = `mock_token_${selectedRole}_${Date.now()}`;
      persistAuth(token, user, selectedRole);
      return { token, user, role: selectedRole };
    }

    // Check registered users
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

    // Role mismatch or wrong credentials
    if (demo && demo.email === normalizedEmail && demo.password !== password) {
      throw new Error('Invalid credentials for the selected role.');
    }
    if (demo && demo.email !== normalizedEmail) {
      throw new Error('Invalid credentials for the selected role.');
    }

    throw new Error('Invalid credentials for the selected role.');
  },

  async register({ name, email, phone, password, confirmPassword, role }) {
    await delay();
    simulateNetworkError();

    const selectedRole = normalizeRole(role);
    const normalizedEmail = (email || '').toLowerCase();

    if (selectedRole === ROLES.ADMIN) {
      throw new Error('Admin accounts cannot be created through public registration.');
    }
    if (![ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.CLIENT].includes(selectedRole)) {
      throw new Error('Invalid role selected.');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    if (findRegisteredUser(normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const user = {
      id: `usr_${Date.now()}`,
      name,
      email: normalizedEmail,
      phone,
      role: selectedRole,
      createdAt: new Date().toISOString(),
    };
    registeredUsers.set(normalizedEmail, { ...user, password });
    return { user, role: selectedRole };
  },

  async logout() {
    await delay(200);
    clearAuth();
    return true;
  },

  async checkAuth() {
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

  async changePassword({ email, currentPassword, newPassword }) {
    await delay();
    simulateNetworkError();
    const demo = Object.values(DEMO_ACCOUNTS).find((d) => d.email === email.toLowerCase());
    if (demo && demo.password === currentPassword) {
      return { success: true };
    }
    const registered = findRegisteredUser(email.toLowerCase());
    if (registered && registered.password === currentPassword) {
      registered.password = newPassword;
      return { success: true };
    }
    throw new Error('Current password is incorrect.');
  },
};

export default authService;