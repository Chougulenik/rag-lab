import React from 'react';

export default function Card({
  children,
  className = '',
  style = {},
  hoverable = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-glass-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.25s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...(hoverable && {
          transform: 'translateY(0)',
        }),
        ...style,
      }}
      className={`custom-card ${hoverable ? 'hoverable-card' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
