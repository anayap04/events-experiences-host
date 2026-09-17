'use client';

import React from 'react';
import AuthPage from '@/features/auth/AuthPage';
import { useRouter } from 'next/navigation';

export default function AuthRoutePage() {
  const router = useRouter();

  return (
    <AuthPage
      onLoginSuccess={() => router.push('/')}
      onBack={() => router.push('/')}
    />
  );
}
