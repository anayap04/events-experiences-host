'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { User } from '@/types';
import { authenticateGitHubUserClient } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGitHub: (username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loginWithGitHub: async () => ({ success: false }),
  logout: () => {},
});

const AUTH_STORAGE_KEY = 'events_auth_user';
const SESSION_TTL_MS = 72 * 60 * 60 * 1000; // 72 hours

interface StoredSession {
  user: User;
  expiresAt: number;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return;

    try {
      const session: StoredSession = JSON.parse(saved);
      const remaining = session.expiresAt - Date.now();
      if (remaining <= 0) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }
      setUser(session.user);
      const timer = setTimeout(logout, remaining);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Failed to parse saved user:', e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [logout]);

  const loginWithGitHub = useCallback(async (username: string) => {
    const res = await authenticateGitHubUserClient(username);
    if (res.success && res.user) {
      setUser(res.user);
      const session: StoredSession = { user: res.user, expiresAt: Date.now() + SESSION_TTL_MS };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, loginWithGitHub, logout }),
    [user, loginWithGitHub, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
