import React from 'react';
import { Modal, Form, Input, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
import './ModalForm.css';

interface ModalFormProps {
  open: boolean;
  title: string;
  fields: {
    name?: string;
    type?: string;
    label?: string;
    value?: any;
    rules?: any;
    options?: { value: string; label: string }[];
    mode?: 'multiple';
    disabled?: boolean;
    onChange: (value: any) => void;
  }[];
  onClose: () => void;
  onSubmit: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ open, title, fields, onClose, onSubmit }) => {
  return (
    <Modal
      maskClosable={false}
      title={title}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          Đồng ý
        </Button>,
      ]}
    >
      <Form layout="vertical">
        {fields.map((field, index) => (
          <Form.Item key={index} label={field.label}>
            {field.type === 'select' ? (
              <Select mode={field.mode} value={field.value} onChange={(value) => field.onChange(value)} style={{ width: '100%' }} disabled={field.disabled} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                {field.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            ) : field.type === 'password' ? (
              <Input.Password value={field.value} onChange={(e) => field.onChange(e.target.value)} disabled={field.disabled} />
            ) : field.type === 'date' ? (
              <DatePicker value={field.value ? moment(field.value) : undefined} onChange={(date, dateString) => field.onChange(dateString)} style={{ width: '100%' }} disabled={field.disabled} />
            ) : (
              <Input value={field.value} onChange={(e) => field.onChange(e.target.value)} disabled={field.disabled} />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default ModalForm;
