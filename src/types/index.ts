export interface Experience {
  id: string;
  name: string;
  slug?: string;
  url: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  thumbnail: string;
  mfeRemoteUrl?: string;
  createdBy?: string;
  createdAt: string;
  lastModified: string;
}

export interface User {
  id?: string;
  githubId: string;
  name: string;
  login: string;
  avatar: string;
  email: string;
  bio?: string;
  publicRepos?: number;
  role?: 'admin' | 'creator' | 'guest';
  isApproved?: boolean;
}

export interface Microfrontend {
  id: string;
  name: string;
  description: string;
  basePath: string;
  remoteUrl: string;
  status: 'active' | 'maintenance' | 'offline';
  version: string;
  wcagLevel: 'WCAG 2.2 AA' | 'WCAG 2.2 AAA';
  category: 'events' | 'experiences' | 'ticketing' | 'shared';
}

export type AuthState = 'idle' | 'connecting' | 'checking' | 'denied' | 'granted';
