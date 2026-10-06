import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Unable to load content',
  message = 'An unexpected error occurred while communicating with the server. Please try again.',
  onRetry = null
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--danger-light)',
      margin: '1rem 0'
    }}>
      <div style={{
        background: 'var(--danger-light)',
        color: 'var(--color-danger)',
        padding: '0.875rem',
        borderRadius: '50%',
        marginBottom: '1rem'
      }}>
        <AlertCircle size={32} />
      </div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--danger-text)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', fontSize: '0.875rem', marginBottom: onRetry ? '1.25rem' : '0' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
