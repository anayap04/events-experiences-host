'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { authenticateGitHubUser } from '@/lib/github-auth';

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

const DEFAULT_USER: User = {
  id: '1',
  githubId: '1001',
  login: 'paolaanaya',
  name: 'Paola Anaya',
  email: 'paola@anayap.tech',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format',
  bio: 'Microfrontend Host Lead & Software Architect',
  publicRepos: 42,
  role: 'admin',
  isApproved: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

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
    const res = await authenticateGitHubUser(username);
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
