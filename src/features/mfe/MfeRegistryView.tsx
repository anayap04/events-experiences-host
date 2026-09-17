'use client';

import React, { useState } from 'react';
import { Card, Tag, Button, Typography, Row, Col, Space } from 'antd';
import { RocketOutlined, RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { getRegisteredMfes } from '@/lib/mfe-registry';
import type { Microfrontend } from '@/types';
import { MfeContainer } from './MfeContainer';

const { Title, Text, Paragraph } = Typography;

export default function MfeRegistryView() {
  const mfes = getRegisteredMfes();
  const [selectedMfeId, setSelectedMfeId] = useState<string>('events');

  const selectedMfe = mfes.find((m) => m.id === selectedMfeId);

  return (
    <div className="space-y-8">
      {/* Container Overview Banner */}
      <Card
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        styles={{ body: { padding: '36px' } }}
      >
        <Space direction="vertical" size={12} style={{ maxWidth: 800 }}>
          <Tag color="blue" style={{ borderRadius: 6, fontWeight: 600 }}>
            Microfrontend Architecture Host
          </Tag>
          <Title level={2} style={{ color: '#ffffff', margin: 0, fontWeight: 800 }}>
            Microfrontend Remote Registry
          </Title>
          <Paragraph style={{ color: '#cbd5e1', fontSize: 16, margin: 0, lineHeight: 1.6 }}>
            The container application dynamically mounts independent remote bundles. Built with Next.js App Router, React 18, Ant Design system tokens, and WCAG 2.2 AA accessibility standards.
          </Paragraph>
        </Space>
      </Card>

      {/* Microfrontend Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Title level={4} style={{ margin: 0 }}>
            Registered Microfrontend Remotes
          </Title>
          <Tag color="purple" style={{ fontFamily: 'monospace' }}>
            {mfes.length} Remotes Active
          </Tag>
        </div>

        <Row gutter={[20, 20]}>
          {mfes.map((mfe: Microfrontend) => {
            const isSelected = mfe.id === selectedMfeId;
            return (
              <Col xs={24} md={8} key={mfe.id}>
                <Card
                  hoverable
                  onClick={() => setSelectedMfeId(mfe.id)}
                  style={{
                    borderRadius: 16,
                    border: isSelected ? '2px solid #1677ff' : '1px solid #e2e8f0',
                    background: isSelected ? '#f0f7ff' : '#ffffff',
                    boxShadow: isSelected ? '0 10px 15px -3px rgba(22, 119, 255, 0.1)' : 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  styles={{ body: { padding: 20, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Tag color="geekblue" style={{ borderRadius: 6, fontWeight: 600 }}>
                        {mfe.category.toUpperCase()}
                      </Tag>
                      <Tag color={mfe.status === 'active' ? 'success' : 'warning'} style={{ borderRadius: 6 }}>
                        {mfe.status.toUpperCase()}
                      </Tag>
                    </div>

                    <Title level={4} style={{ margin: 0, color: '#0f172a' }}>
                      {mfe.name}
                    </Title>

                    <Paragraph type="secondary" style={{ fontSize: 13, margin: 0 }} ellipsis={{ rows: 2 }}>
                      {mfe.description}
                    </Paragraph>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                    <Button
                      type={isSelected ? 'primary' : 'default'}
                      size="small"
                      icon={<RocketOutlined />}
                      onClick={(e) => { e.stopPropagation(); setSelectedMfeId(mfe.id); }}
                      style={{ borderRadius: 6 }}
                    >
                      {isSelected ? 'Active Mount' : 'Inspect'}
                    </Button>

                    <Link
                      href={mfe.basePath}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>Go to Route</span>
                      <RightOutlined style={{ fontSize: 10 }} />
                    </Link>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* Selected MFE Live Container View */}
      {selectedMfe && (
        <div className="space-y-4 pt-4">
          <Title level={4} style={{ margin: 0 }}>
            Inspecting Microfrontend Remote: <span style={{ color: '#1677ff' }}>{selectedMfe.name}</span>
          </Title>

          <MfeContainer
            mfeId={selectedMfe.id}
            title={selectedMfe.name}
          />
        </div>
      )}
    </div>
  );
}
