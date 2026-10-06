import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{
          background: danger ? 'var(--danger-light)' : 'var(--warning-light)',
          color: danger ? 'var(--color-danger)' : 'var(--color-warning)',
          padding: '0.625rem',
          borderRadius: '50%',
          display: 'flex'
        }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
