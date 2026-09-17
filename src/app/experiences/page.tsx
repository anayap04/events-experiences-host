'use client';

import React from 'react';
import { MfeContainer } from '@/features/mfe/MfeContainer';
import { Layout, Typography, Card, Tag } from 'antd';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function ExperiencesMfePage() {
  return (
    <Content style={{ padding: '32px 28px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      <div className="space-y-8">
        <Card
          style={{
            borderRadius: 20,
            background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          styles={{ body: { padding: '36px' } }}
        >
          <div className="space-y-3">
            <Tag color="purple">Microfrontend Route: /experiences</Tag>
            <Title level={2} style={{ color: '#fff', margin: 0 }}>
              Interactive Experiences Remote Sub-Module
            </Title>
            <Paragraph style={{ color: '#cbd5e1', fontSize: 16, margin: 0 }}>
              Dedicated host sub-route isolating pop-ups, VIP tours, and interactive experience remotes.
            </Paragraph>
          </div>
        </Card>

        <MfeContainer mfeId="experiences" title="Interactive Experiences Remote" />
      </div>
    </Content>
  );
}
