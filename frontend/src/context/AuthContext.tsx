import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import authService from '../services/authService';
import { Role } from '../types/constants';

interface AuthContextType {
  user: any;
  role: Role | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  hasRole: (...allowedRoles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialize = useCallback(async () => {
    try {
      const data = await authService.checkAuth();
      if (data) {
        setUser(data.user);
        setRole(data.role as Role);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Auth check failed', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { initialize(); }, [initialize]);

  const login = async (credentials: any) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setRole(result.role as Role);
    setIsAuthenticated(true);
    return result;
  };

  const register = async (data: any) => {
    const result = await authService.register(data);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const hasRole = (...allowedRoles: Role[]) => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  const value: AuthContextType = {
    user, role, isAuthenticated, loading, login, register, logout, hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;