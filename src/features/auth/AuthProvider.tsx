'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('events_auth_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
  }, []);

  const loginWithGitHub = async (username: string) => {
    const res = await authenticateGitHubUserClient(username);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('events_auth_user', JSON.stringify(res.user));
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('events_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginWithGitHub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
