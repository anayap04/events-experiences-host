'use client';

import React from 'react';
import MfeRegistryView from '@/features/mfe/MfeRegistryView';
import { Layout } from 'antd';

const { Content } = Layout;

export default function EventsMfePage() {
  return (
    <Content style={{ padding: '32px 28px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      <MfeRegistryView />
    </Content>
  );
}
