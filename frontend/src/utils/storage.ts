import { AUTH_STORAGE_KEY, TOKEN_KEY, USER_KEY, ROLE_KEY } from '../types/constants';

export function getAuthData(): { token: string; user: any; role: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse auth data', error);
  }
  return null;
}

export function setAuthData(token: string, user: any, role: string): void {
  const data = { token, user, role };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (role) localStorage.setItem(ROLE_KEY, role);
}

export function clearAuthData(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getToken(): string | null {
  const data = getAuthData();
  return data?.token || null;
}

export function getCurrentUser(): any {
  const data = getAuthData();
  return data?.user || null;
}

export function getCurrentRole(): string | null {
  const data = getAuthData();
  return data?.role || null;
}