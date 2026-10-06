import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  message = 'There is currently no information to display here.',
  actionLabel = '',
  onAction = null
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 1.5rem',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-medium)',
      margin: '1rem 0'
    }}>
      <div style={{
        background: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        padding: '1rem',
        borderRadius: '50%',
        marginBottom: '1rem'
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', fontSize: '0.875rem', marginBottom: actionLabel ? '1.25rem' : '0' }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
