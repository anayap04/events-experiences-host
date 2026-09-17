'use client';

import React from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import EventsDashboard from '@/features/events/EventsDashboard';
import AuthPage from '@/features/auth/AuthPage';

export default function HostDashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  return <EventsDashboard user={user} />;
}
