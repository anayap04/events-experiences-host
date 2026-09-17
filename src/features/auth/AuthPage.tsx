'use client';

import React, { useState } from 'react';
import { Button, Typography, Divider, Spin, Input, Card, Alert, Tag } from 'antd';
import {
  GithubOutlined,
  LockOutlined,
  StarOutlined,
  ForkOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { AuthState } from '@/types';
import { useAuth } from './AuthProvider';

const { Title, Text, Paragraph } = Typography;

interface AuthPageProps {
  onLoginSuccess?: () => void;
  onBack?: () => void;
}

export default function AuthPage({ onLoginSuccess, onBack }: AuthPageProps) {
  const { loginWithGitHub } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [githubUsername, setGithubUsername] = useState('paolaanaya');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGitHubLogin = async () => {
    if (!githubUsername.trim()) {
      setErrorMessage('Please enter a GitHub username or account ID.');
      return;
    }
    setErrorMessage('');
    setAuthState('connecting');

    await new Promise(r => setTimeout(r, 600));
    setAuthState('checking');

    const result = await loginWithGitHub(githubUsername);
    if (result.success) {
      setAuthState('granted');
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 500);
    } else {
      setAuthState('denied');
      setErrorMessage(result.error || 'User not found or access not granted in phpMyAdmin database.');
    }
  };

  const isLoading = authState === 'connecting' || authState === 'checking';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Informational Panel */}
        <div className="text-white space-y-6 p-4">
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <StarOutlined style={{ color: '#60a5fa' }} />
            <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>
              Events & Experiences Container Shell
            </Text>
          </div>

          <Title level={1} style={{ color: '#ffffff', fontSize: 38, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
            Microfrontend Container & GitHub Authentication
          </Title>

          <Paragraph style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6 }}>
            Sign in with your GitHub account to access the Events Creator container, register microfrontend remotes, and manage private experiences.
          </Paragraph>

          <div className="space-y-4 pt-2">
            {[
              {
                icon: <GithubOutlined style={{ color: '#38bdf8' }} />,
                title: 'GitHub Identity Retrieval',
                desc: 'Fetches user profile, avatar, email, and public repository counts via REST API.',
              },
              {
                icon: <DatabaseOutlined style={{ color: '#4ade80' }} />,
                title: 'phpMyAdmin MySQL Verification',
                desc: 'Queries approved creator records directly from your phpMyAdmin database table.',
              },
              {
                icon: <LockOutlined style={{ color: '#a78bfa' }} />,
                title: 'Microfrontend RBAC',
                desc: 'Ensures authorized organizers can build and mount independent event micro-apps.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {item.icon}
                </div>
                <div>
                  <Text strong style={{ color: '#f8fafc', fontSize: 14 }}>{item.title}</Text>
                  <Paragraph style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>{item.desc}</Paragraph>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Ant Design Card Panel */}
        <Card
          style={{
            borderRadius: 20,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
          styles={{ body: { padding: '36px 28px' } }}
        >
          {authState === 'denied' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <CloseCircleOutlined style={{ fontSize: 32, color: '#f87171' }} />
              </div>
              <Title level={3} style={{ color: '#ffffff', margin: 0 }}>Access Not Granted</Title>
              <Text style={{ color: '#cbd5e1', fontSize: 14, display: 'block' }}>
                {errorMessage}
              </Text>

              <Alert
                type="warning"
                showIcon
                message="phpMyAdmin Database Note"
                description="Make sure your GitHub username is added to the 'users' table in phpMyAdmin (or database/phpmyadmin_events_db.sql)."
                style={{ borderRadius: 10, textAlign: 'left', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
              />

              <Button
                type="primary"
                block
                size="large"
                onClick={() => setAuthState('idle')}
                icon={<ArrowLeftOutlined />}
                style={{ borderRadius: 10, marginTop: 12 }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Tag color="blue" style={{ borderRadius: 6, marginBottom: 8 }}>
                  <DatabaseOutlined /> phpMyAdmin Auth Connected
                </Tag>
                <Title level={3} style={{ color: '#ffffff', margin: 0, fontWeight: 700 }}>
                  GitHub Sign In
                </Title>
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>
                  Enter your GitHub account to verify phpMyAdmin permissions.
                </Text>
              </div>

              <div className="space-y-4">
                <div>
                  <Text style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                    GitHub Username or Email
                  </Text>
                  <Input
                    size="large"
                    prefix={<GithubOutlined style={{ color: '#94a3b8' }} />}
                    placeholder="e.g. paolaanaya or alexrivera"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    disabled={isLoading}
                    style={{ borderRadius: 10, background: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  />
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  icon={isLoading ? <Spin size="small" /> : <GithubOutlined />}
                  onClick={handleGitHubLogin}
                  disabled={isLoading}
                  style={{
                    height: 48,
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 15,
                    background: '#1677ff',
                  }}
                >
                  {isLoading ? 'Verifying with GitHub & phpMyAdmin...' : 'Continue with GitHub'}
                </Button>
              </div>

              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }}>
                <Text style={{ color: '#64748b', fontSize: 12 }}>Verification Pipeline</Text>
              </Divider>

              <div className="space-y-2.5">
                {[
                  { label: 'Fetch GitHub User Profile Metadata', done: true },
                  { label: 'Check phpMyAdmin MySQL database `users` table', done: true },
                  { label: 'Grant Microfrontend Event Creator Privileges', done: true },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
                    <CheckCircleOutlined style={{ color: '#10b981' }} />
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>

              {onBack && (
                <div className="text-center pt-2">
                  <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ color: '#94a3b8' }}>
                    Back to Host Overview
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
