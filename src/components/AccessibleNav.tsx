'use client';

import React from 'react';
import { Layout, Avatar, Dropdown, Button, Typography, Space, Tag } from 'antd';
import {
  StarOutlined,
  GithubOutlined,
  LogoutOutlined,
  UserOutlined,
  AppstoreOutlined,
  RocketOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthProvider';

const { Header } = Layout;
const { Text } = Typography;

export function AccessibleNav() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const userMenuItems = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div className="py-1">
          <Text strong style={{ display: 'block', fontSize: 14 }}>{user?.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>@{user?.login}</Text>
          {user?.role && (
            <div className="mt-1">
              <Tag color="blue" style={{ borderRadius: 4, fontSize: 10 }}>
                {user.role.toUpperCase()}
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'github-profile',
      icon: <GithubOutlined />,
      label: 'GitHub Profile',
      onClick: () => user && window.open(`https://github.com/${user.login}`, '_blank'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign out',
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <Header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 28px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Brand Logo & Name */}
      <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#1677ff', boxShadow: '0 4px 10px rgba(22, 119, 255, 0.3)' }}
        >
          <StarOutlined style={{ color: '#ffffff', fontSize: 18 }} />
        </div>
        <div>
          <Text strong style={{ fontSize: 16, color: '#0f172a', letterSpacing: '-0.3px', display: 'block', lineHeight: 1.2 }}>
            Events Experiences
          </Text>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', lineHeight: 1 }}>
            Microfrontend Container Shell
          </Text>
        </div>
      </Link>

      {/* Nav Navigation Links */}
      {isAuthenticated && user && (
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2">
          {[
            { label: 'Host Dashboard', path: '/', icon: <AppstoreOutlined /> },
            { label: 'Events Remotes', path: '/events', icon: <RocketOutlined /> },
            { label: 'Experiences Remotes', path: '/experiences', icon: <StarOutlined /> },
          ].map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                style={{ textDecoration: 'none' }}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* User Auth Section */}
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <div className="flex items-center gap-2.5 cursor-pointer px-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <Avatar src={user.avatar} size={34} icon={<UserOutlined />} style={{ background: '#1677ff' }}>
                {user.name?.[0]}
              </Avatar>
              <div className="hidden sm:block text-left">
                <Text strong style={{ fontSize: 13, color: '#0f172a', display: 'block', lineHeight: 1.2 }}>
                  {user.name}
                </Text>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', lineHeight: 1 }}>
                  @{user.login}
                </Text>
              </div>
            </div>
          </Dropdown>
        ) : (
          <Link href="/auth">
            <Button type="primary" icon={<LoginOutlined />} style={{ borderRadius: 8 }}>
              Sign In with GitHub
            </Button>
          </Link>
        )}
      </div>
    </Header>
  );
}
