'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Layout, Button, Input, Select, Typography, Empty, Tag, Modal, message, Space, Card, Badge, Tooltip
} from 'antd';
import {
  PlusOutlined, SearchOutlined, RocketOutlined, AppstoreOutlined,
  UnorderedListOutlined, FilterOutlined, DatabaseOutlined, ReloadOutlined
} from '@ant-design/icons';
import EventCard from './EventCard';
import EventCreatorModal from './EventCreatorModal';
import { MfeContainer } from '@/features/mfe/MfeContainer';
import { fetchEventsClient, saveEventClient, deleteEventClient } from '@/lib/api-client';
import { registerCustomMfe } from '@/lib/mfe-registry';
import type { Experience, User } from '@/types';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface EventsDashboardProps {
  user: User;
}

export default function EventsDashboard({ user }: EventsDashboardProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [selectedMfeExp, setSelectedMfeExp] = useState<Experience | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [messageApi, contextHolder] = message.useMessage();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEventsClient();
      setExperiences(data);
      if (data.length > 0) {
        setSelectedMfeExp(current => current ?? data[0]);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    return [...new Set(experiences.map(e => e.category))];
  }, [experiences]);

  const filtered = useMemo(() => {
    return experiences.filter(exp => {
      const matchSearch =
        exp.name.toLowerCase().includes(search.toLowerCase()) ||
        exp.description.toLowerCase().includes(search.toLowerCase()) ||
        exp.url.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || exp.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || exp.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [experiences, search, categoryFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: experiences.length,
    active: experiences.filter(e => e.status === 'active').length,
    draft: experiences.filter(e => e.status === 'draft').length,
    archived: experiences.filter(e => e.status === 'archived').length,
  }), [experiences]);

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const exp = experiences.find(e => e.id === id);
    Modal.confirm({
      title: 'Delete event experience',
      content: `Are you sure you want to remove "${exp?.name}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteEventClient(id);
        setExperiences(prev => prev.filter(e => e.id !== id));
        if (selectedMfeExp?.id === id) setSelectedMfeExp(null);
        messageApi.success('Event removed');
      },
    });
  };

  const handleSave = async (values: Omit<Experience, 'id' | 'createdAt' | 'lastModified'>) => {
    const today = new Date().toISOString().split('T')[0];
    const eventId = editingExp ? editingExp.id : String(Date.now());
    const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newExp: Experience = {
      ...values,
      id: eventId,
      slug,
      createdBy: user.login,
      createdAt: editingExp ? editingExp.createdAt : today,
      lastModified: today,
    };

    if (newExp.mfeRemoteUrl) {
      registerCustomMfe({
        id: `mfe-${slug}`,
        name: newExp.name,
        description: newExp.description,
        basePath: `/events/${slug}`,
        remoteUrl: newExp.mfeRemoteUrl,
        status: newExp.status === 'active' ? 'active' : 'maintenance',
        version: '1.0.0',
        wcagLevel: 'WCAG 2.2 AA',
        category: 'events',
      });
    }

    await saveEventClient(newExp);

    if (editingExp) {
      setExperiences(prev => prev.map(e => e.id === editingExp.id ? newExp : e));
      messageApi.success('Event updated');
    } else {
      setExperiences(prev => [newExp, ...prev]);
      messageApi.success('New Microfrontend Event created and saved');
    }

    setSelectedMfeExp(newExp);
    setModalOpen(false);
    setEditingExp(null);
  };

  return (
    <Content style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      {contextHolder}

      {/* Banner / Header */}
      <Card
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 28,
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag color="blue" style={{ borderRadius: 6 }}>
                <DatabaseOutlined /> phpMyAdmin MySQL DB Sync
              </Tag>
              <Tag color="purple" style={{ borderRadius: 6 }}>
                <RocketOutlined /> Microfrontend Host Container
              </Tag>
            </div>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
              Events Creator Shell
            </Title>
            <Paragraph style={{ color: '#94a3b8', margin: 0, fontSize: 15, maxWidth: 680 }}>
              Build and orchestrate private event micro-applications. Each event acts as an isolated microfrontend module running within the main host shell.
            </Paragraph>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Reload Events">
              <Button
                icon={<ReloadOutlined spin={loading} />}
                onClick={loadData}
                style={{ borderRadius: 10, height: 44 }}
              >
                Sync DB
              </Button>
            </Tooltip>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => { setEditingExp(null); setModalOpen(true); }}
              style={{ borderRadius: 10, height: 44, fontWeight: 600, paddingLeft: 24, paddingRight: 24 }}
            >
              Create New Event MFE
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Events', value: stats.total, color: '#1677ff' },
          { label: 'Active Remotes', value: stats.active, color: '#52c41a' },
          { label: 'Draft Remotes', value: stats.draft, color: '#fa8c16' },
          { label: 'Archived', value: stats.archived, color: '#9ca3af' },
        ].map(s => (
          <Card key={s.label} styles={{ body: { padding: 18 } }} style={{ borderRadius: 14, border: '1px solid #e2e8f0' }}>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ background: `${s.color}15`, color: s.color }}
              >
                {s.value}
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>{s.label}</Text>
                <Text strong style={{ fontSize: 20 }}>{s.value}</Text>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <Input
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            placeholder="Search events or remote URLs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ width: 280, borderRadius: 8 }}
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 160 }}
            suffixIcon={<FilterOutlined />}
          >
            <Select.Option value="all">All Categories</Select.Option>
            {categories.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
          </Select>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
          >
            <Select.Option value="all">All Statuses</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="archived">Archived</Select.Option>
          </Select>
        </div>

        <Space align="center">
          <Text type="secondary" style={{ fontSize: 13 }}>
            Showing {filtered.length} of {experiences.length}
          </Text>
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            <Button
              type={viewMode === 'grid' ? 'primary' : 'text'}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('grid')}
              style={{ borderRadius: 0, height: 36 }}
            />
            <Button
              type={viewMode === 'list' ? 'primary' : 'text'}
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode('list')}
              style={{ borderRadius: 0, height: 36 }}
            />
          </div>
        </Space>
      </div>

      {/* Grid of Event Cards */}
      {filtered.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: 40 }}>
          <Empty description="No events matching your filters in phpMyAdmin database">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Create Event
            </Button>
          </Empty>
        </Card>
      ) : (
        <div
          className={viewMode === 'grid' ? 'grid gap-6' : 'flex flex-col gap-4'}
          style={viewMode === 'grid' ? { gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' } : {}}
        >
          {filtered.map(exp => (
            <EventCard
              key={exp.id}
              experience={exp}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInspectMfe={(selected) => setSelectedMfeExp(selected)}
            />
          ))}
        </div>
      )}

      {/* Live Microfrontend Sandbox Inspection */}
      {selectedMfeExp && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Active Event Microfrontend Container: <span style={{ color: '#1677ff' }}>{selectedMfeExp.name}</span>
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Dynamic Microfrontend Sandbox running isolated remote Javascript bundle.
              </Text>
            </div>
            <Tag color="green" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6 }}>
              MFE REMOTE CONNECTED
            </Tag>
          </div>

          <MfeContainer
            mfeId={selectedMfeExp.slug || selectedMfeExp.id}
            title={`${selectedMfeExp.name} (${selectedMfeExp.category})`}
            demoContent={
              <Card
                style={{ borderRadius: 14, background: '#0f172a', borderColor: '#334155' }}
                styles={{ body: { color: '#f8fafc' } }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <Text strong style={{ color: '#fff', fontSize: 16 }}>
                        {selectedMfeExp.name}
                      </Text>
                    </div>
                    <Badge status="processing" text={<span className="text-slate-300 font-mono text-xs">{selectedMfeExp.mfeRemoteUrl || 'Remote Sandbox'}</span>} />
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedMfeExp.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Tag color="blue">Category: {selectedMfeExp.category}</Tag>
                    <Tag color="cyan">Status: {selectedMfeExp.status}</Tag>
                    <Tag color="gold">Creator: @{selectedMfeExp.createdBy || user.login}</Tag>
                  </div>
                </div>
              </Card>
            }
          />
        </div>
      )}

      <EventCreatorModal
        open={modalOpen}
        experience={editingExp}
        onClose={() => { setModalOpen(false); setEditingExp(null); }}
        onSave={handleSave}
      />
    </Content>
  );
}
