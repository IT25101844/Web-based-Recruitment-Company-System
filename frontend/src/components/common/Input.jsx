import React from 'react';

export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  icon: Icon = null,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 12, color: 'var(--color-text-light)', pointerEvents: 'none', display: 'flex' }}>
            <Icon size={16} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${error ? 'error' : ''}`}
          style={Icon ? { paddingLeft: '2.35rem' } : {}}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
      {helpText && !error && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.25rem', display: 'block' }}>{helpText}</span>}
    </div>
  );
};

export default Input;

