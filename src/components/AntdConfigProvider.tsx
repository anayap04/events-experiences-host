'use client';

import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

export default function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f8fafc',
          colorTextHeading: '#0f172a',
          colorTextBody: '#334155',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
            fontWeight: 600,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Modal: {
            borderRadiusLG: 16,
          },
          Card: {
            borderRadiusLG: 16,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
