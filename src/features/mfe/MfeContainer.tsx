'use client';

import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import { Card, Tag, Alert, Spin, Button, Typography, Space } from 'antd';
import { RocketOutlined, AlertOutlined, ReloadOutlined } from '@ant-design/icons';
import { getMfeById } from '@/lib/mfe-registry';
import type { Microfrontend } from '@/types';
import { useLiveAnnouncer } from '@/components/LiveAnnouncer';

const { Text, Title } = Typography;

interface ErrorBoundaryProps {
  fallbackTitle: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class MfeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Microfrontend isolated error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert
          type="error"
          showIcon
          icon={<AlertOutlined />}
          message={`${this.props.fallbackTitle} Failed to Load`}
          description={
            <div className="space-y-2 mt-1">
              <p>The micro-application encountered an isolated runtime error. The host container shell remains functional.</p>
              <Button
                size="small"
                danger
                icon={<ReloadOutlined />}
                onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              >
                Retry Mounting Remote Bundle
              </Button>
            </div>
          }
          style={{ borderRadius: 12, margin: '16px 0' }}
        />
      );
    }
    return this.props.children;
  }
}

interface MfeContainerProps {
  mfeId: string;
  title?: string;
  demoContent?: ReactNode;
}

export const MfeContainer: React.FC<MfeContainerProps> = ({ mfeId, title, demoContent }) => {
  const [mfe, setMfe] = useState<Microfrontend | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'maintenance'>('loading');
  const { announce } = useLiveAnnouncer();

  useEffect(() => {
    const config = getMfeById(mfeId);
    setMfe(config);

    if (!config) {
      setLoadStatus('idle');
      setIsLoading(false);
      return;
    }

    if (config.status === 'maintenance') {
      setLoadStatus('maintenance');
      setIsLoading(false);
      announce(`${config.name} is currently under scheduled maintenance.`, 'polite');
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoadStatus('success');
      announce(`${config.name} loaded successfully.`, 'polite');
    }, 350);

    return () => clearTimeout(timer);
  }, [mfeId, announce]);

  const regionTitle = title || mfe?.name || `Microfrontend ${mfeId}`;

  return (
    <MfeErrorBoundary fallbackTitle={regionTitle}>
      <Card
        style={{
          borderRadius: 16,
          background: '#0f172a',
          borderColor: '#334155',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
        styles={{ body: { padding: 24 } }}
      >
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <RocketOutlined style={{ color: '#60a5fa', fontSize: 18 }} />
              <Title level={4} style={{ color: '#fff', margin: 0 }}>{regionTitle}</Title>
            </div>
            {mfe?.description && (
              <Text style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginTop: 4 }}>
                {mfe.description}
              </Text>
            )}
          </div>

          <Space wrap size={[8, 8]}>
            <Tag color="geekblue" style={{ borderRadius: 6, margin: 0, fontFamily: 'monospace' }}>
              ID: {mfeId}
            </Tag>
            {mfe && (
              <>
                <Tag color="purple" style={{ borderRadius: 6, margin: 0, fontFamily: 'monospace' }}>
                  v{mfe.version}
                </Tag>
                <Tag color="green" style={{ borderRadius: 6, margin: 0 }}>
                  {mfe.wcagLevel}
                </Tag>
              </>
            )}
          </Space>
        </div>

        {/* Dynamic Loading State */}
        {isLoading && (
          <div className="flex flex-col gap-3 py-10 items-center justify-center text-slate-400">
            <Spin size="large" />
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>
              Mounting dynamic remote bundle entry ({mfeId})...
            </Text>
          </div>
        )}

        {/* Maintenance Alert */}
        {loadStatus === 'maintenance' && (
          <Alert
            type="warning"
            showIcon
            message="Scheduled Maintenance"
            description={`The ${mfe?.name} is undergoing scheduled upgrades to meet enhanced WCAG standards.`}
            style={{ borderRadius: 10 }}
          />
        )}

        {/* Loaded Remote MFE Content */}
        {!isLoading && (loadStatus === 'success' || loadStatus === 'idle') && (
          <div id={`mfe-mount-${mfeId}`} className="mfe-content-area">
            {demoContent || (
              <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <Text strong style={{ color: '#f8fafc', fontSize: 15 }}>
                    Live Microfrontend Container Sandbox
                  </Text>
                  <Tag color="blue" style={{ fontFamily: 'monospace' }}>
                    {mfe?.remoteUrl || 'https://events.anayap.tech/remoteEntry.js'}
                  </Tag>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  This component is dynamically loaded into the host container shell from sub-route <code className="text-indigo-400 bg-slate-900 px-1.5 py-0.5 rounded">{mfe?.basePath || '/events'}</code>.
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </MfeErrorBoundary>
  );
};
