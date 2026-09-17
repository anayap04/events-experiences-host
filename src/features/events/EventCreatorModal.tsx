'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Typography, Alert, Space } from 'antd';
import { RocketOutlined, GlobalOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { Experience } from '@/types';

const { Text } = Typography;

interface EventCreatorModalProps {
  open: boolean;
  experience?: Experience | null;
  onClose: () => void;
  onSave: (values: Omit<Experience, 'id' | 'createdAt' | 'lastModified'>) => void;
}

export default function EventCreatorModal({
  open,
  experience,
  onClose,
  onSave,
}: EventCreatorModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (experience) {
        form.setFieldsValue({
          name: experience.name,
          url: experience.url,
          description: experience.description,
          category: experience.category,
          status: experience.status,
          thumbnail: experience.thumbnail,
          mfeRemoteUrl: experience.mfeRemoteUrl || 'https://events.anayap.tech/remoteEntry.js',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          category: 'Baby Shower',
          status: 'active',
          thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=340&fit=crop&auto=format',
          mfeRemoteUrl: 'https://events.anayap.tech/remoteEntry.js',
        });
      }
    }
  }, [open, experience, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (err) {
      console.error('Form validation failed:', err);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <Space align="center" style={{ gap: 8 }}>
          <RocketOutlined style={{ color: '#1677ff', fontSize: 20 }} />
          <span>{experience ? 'Edit Microfrontend Event' : 'Create New Event Experience'}</span>
        </Space>
      }
      okText={experience ? 'Save Changes' : 'Publish Event MFE'}
      cancelText="Cancel"
      onCancel={onClose}
      onOk={handleSubmit}
      width={600}
      style={{ top: 30 }}
      styles={{ body: { paddingTop: 16 } }}
    >
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message="Microfrontend Container Integration"
        description="Creating an event auto-registers a sub-microfrontend entry that mounts inside the host container shell."
        style={{ marginBottom: 20, borderRadius: 10 }}
      />

      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          name="name"
          label={<Text strong>Event Title</Text>}
          rules={[{ required: true, message: 'Please enter the event name' }]}
        >
          <Input placeholder="e.g. Annual Design Summit 2026" size="large" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label={<Text strong>Category</Text>}
            rules={[{ required: true, message: 'Select category' }]}
          >
            <Select size="large">
              <Select.Option value="Baby Shower">Baby Shower</Select.Option>
              <Select.Option value="Birthday">Birthday</Select.Option>
              <Select.Option value="Wedding">Wedding</Select.Option>
              <Select.Option value="Conference">Conference</Select.Option>
              <Select.Option value="Family Reunion">Family Reunion</Select.Option>
              <Select.Option value="Farewell">Farewell</Select.Option>
              <Select.Option value="Workshop">Workshop</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={<Text strong>Publishing Status</Text>}
            rules={[{ required: true, message: 'Select status' }]}
          >
            <Select size="large">
              <Select.Option value="active">Active (Published)</Select.Option>
              <Select.Option value="draft">Draft (Private)</Select.Option>
              <Select.Option value="archived">Archived</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="url"
          label={<Text strong>Event Public Web URL</Text>}
          rules={[{ required: true, message: 'Please enter a valid URL' }]}
        >
          <Input prefix={<GlobalOutlined style={{ color: '#94a3b8' }} />} placeholder="https://myevent.anayap.tech" size="large" />
        </Form.Item>

        <Form.Item
          name="mfeRemoteUrl"
          label={<Text strong>Microfrontend Remote Entry JS URL</Text>}
          rules={[{ required: true, message: 'Please specify the remote bundle URL' }]}
        >
          <Input placeholder="https://events.anayap.tech/remoteEntry.js" size="large" />
        </Form.Item>

        <Form.Item
          name="thumbnail"
          label={<Text strong>Thumbnail Image URL</Text>}
        >
          <Input placeholder="https://images.unsplash.com/..." size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<Text strong>Event Description & Guest Instructions</Text>}
          rules={[{ required: true, message: 'Please describe the event' }]}
        >
          <Input.TextArea rows={3} placeholder="Provide agenda, RSVP details, or guest instructions..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
