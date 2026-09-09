import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import authService from '../services/authService';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialize = useCallback(async () => {
    try {
      const data = await authService.checkAuth();
      if (data) {
        setUser(data.user);
        setRole(data.role);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Auth check failed', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setRole(result.role);
    setIsAuthenticated(true);
    return result;
  };

  const register = async (data) => {
    const result = await authService.register(data);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const hasRole = (...allowedRoles) => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;