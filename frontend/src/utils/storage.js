import { AUTH_STORAGE_KEY, TOKEN_KEY, USER_KEY, ROLE_KEY } from './constants';

export const getAuthData = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.warn('Failed to parse auth data from localStorage', error);
  }
  return null;
};

export const setAuthData = (token, user, role) => {
  const data = { token, user, role };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (role) localStorage.setItem(ROLE_KEY, role);
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const getToken = () => {
  const data = getAuthData();
  return data?.token || null;
};

export const getCurrentUser = () => {
  const data = getAuthData();
  return data?.user || null;
};

export const getCurrentRole = () => {
  const data = getAuthData();
  return data?.role || null;
};