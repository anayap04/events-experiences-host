'use client';

import React from 'react';
import { Card, Tag, Dropdown, Button, Typography, Tooltip } from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  CalendarOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import type { Experience } from '@/types';

const { Text, Paragraph } = Typography;

const STATUS_COLOR: Record<Experience['status'], string> = {
  active: 'success',
  draft: 'warning',
  archived: 'default',
};

interface EventCardProps {
  readonly experience: Experience;
  readonly onEdit: (exp: Experience) => void;
  readonly onDelete: (id: string) => void;
  readonly onInspectMfe?: (exp: Experience) => void;
}

export default function EventCard({ experience, onEdit, onDelete, onInspectMfe }: EventCardProps) {
  const menuItems = [
    {
      key: 'inspect',
      icon: <RocketOutlined />,
      label: 'Inspect Microfrontend',
      onClick: () => onInspectMfe && onInspectMfe(experience),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit Event Settings',
      onClick: () => onEdit(experience),
    },
    {
      key: 'open',
      icon: <LinkOutlined />,
      label: 'Open Event URL',
      onClick: () => window.open(experience.url, '_blank'),
    },
    { type: 'divider' as const },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete Event',
      danger: true,
      onClick: () => onDelete(experience.id),
    },
  ];

  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
      styles={{ body: { padding: 18 } }}
    >
      {/* Thumbnail Header */}
      <div className="relative overflow-hidden rounded-xl mb-4" style={{ height: 160, background: '#f1f5f9' }}>
        <img
          src={experience.thumbnail}
          alt={experience.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%)' }}
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Tag color={STATUS_COLOR[experience.status]} style={{ fontWeight: 600, borderRadius: 6 }}>
            {experience.status.toUpperCase()}
          </Tag>
          <Tag color="geekblue" style={{ borderRadius: 6 }}>
            {experience.category}
          </Tag>
        </div>

        {/* Dropdown Menu */}
        <div className="absolute top-3 right-3">
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button
              size="small"
              icon={<MoreOutlined />}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: 8,
                backdropFilter: 'blur(4px)',
              }}
            />
          </Dropdown>
        </div>

        {/* Created By Tag */}
        {experience.createdBy && (
          <div className="absolute bottom-2.5 left-3">
            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-900/80 text-slate-200 border border-slate-700/60">
              Creator: @{experience.createdBy}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="space-y-2">
        <Text strong style={{ fontSize: 16, color: '#0f172a', display: 'block', lineHeight: 1.3 }}>
          {experience.name}
        </Text>

        <Tooltip title={experience.url}>
          <a
            href={experience.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800"
            style={{ textDecoration: 'none' }}
          >
            <LinkOutlined style={{ fontSize: 11 }} />
            <Text style={{ color: '#1677ff', fontSize: 12 }} ellipsis>
              {experience.url.replace(/^https?:\/\//, '')}
            </Text>
          </a>
        </Tooltip>

        <Paragraph
          type="secondary"
          style={{ fontSize: 13, lineHeight: 1.5, color: '#64748b', marginBottom: 12 }}
          ellipsis={{ rows: 2 }}
        >
          {experience.description}
        </Paragraph>

        {/* MFE Endpoint Tag */}
        {experience.mfeRemoteUrl && (
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 truncate">
            Remote: {experience.mfeRemoteUrl}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <CalendarOutlined style={{ fontSize: 11 }} />
            <span>Updated {experience.lastModified}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<RocketOutlined />}
              onClick={() => onInspectMfe && onInspectMfe(experience)}
              style={{ borderRadius: 6, fontSize: 12 }}
            >
              MFE Remote
            </Button>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(experience)}
              style={{ color: '#64748b' }}
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={() => onDelete(experience.id)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
