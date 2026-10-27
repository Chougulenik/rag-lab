import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent'
  size = 'sm',
  className = '',
}) {
  const variantStyles = {
    default: {
      background: 'rgba(148, 163, 184, 0.12)',
      color: 'var(--text-secondary)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
    },
    success: {
      background: 'var(--success-bg)',
      color: 'var(--success)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    warning: {
      background: 'var(--warning-bg)',
      color: 'var(--warning)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    error: {
      background: 'var(--error-bg)',
      color: 'var(--error)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    info: {
      background: 'var(--info-bg)',
      color: 'var(--info)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
    },
    accent: {
      background: 'rgba(99, 102, 241, 0.18)',
      color: '#818cf8',
      border: '1px solid rgba(99, 102, 241, 0.35)',
    },
  }[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: size === 'sm' ? '0.2rem 0.55rem' : '0.35rem 0.85rem',
        fontSize: size === 'sm' ? '0.75rem' : '0.85rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        lineHeight: 1,
        letterSpacing: '0.02em',
        ...variantStyles,
      }}
      className={className}
    >
      {children}
    </span>
  );
}
