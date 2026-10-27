import React, { useState } from 'react';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import CitationBadge from './CitationBadge';

export default function MessageBubble({ message, onCitationClick }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: isUser ? 'rgba(30, 41, 59, 0.35)' : 'rgba(15, 23, 42, 0.65)',
        border: `1px solid ${isUser ? 'rgba(255, 255, 255, 0.04)' : 'var(--border-subtle)'}`,
        backdropFilter: 'blur(10px)',
        marginBottom: '1rem',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
          background: isUser ? 'var(--bg-tertiary)' : 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isUser ? 'none' : 'var(--accent-glow)',
        }}
      >
        {isUser ? <User size={18} color="var(--text-secondary)" /> : <Sparkles size={18} color="#ffffff" />}
      </div>

      {/* Message Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isUser ? 'var(--text-secondary)' : 'var(--accent-secondary)' }}>
            {isUser ? 'You' : 'RAG Assistant'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {message.timestamp && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {message.timestamp}
              </span>
            )}
            {!isUser && message.content && (
              <button
                onClick={handleCopy}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Copy response"
              >
                {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Content with whitespace formatting and streaming cursor */}
        <div
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.65,
            color: 'var(--text-primary)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
          {message.isStreaming && (
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '16px',
                marginLeft: '4px',
                backgroundColor: 'var(--accent-secondary)',
                animation: 'pulse 0.8s infinite',
                verticalAlign: 'middle',
              }}
            />
          )}
        </div>

        {/* Citations section */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div
            style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Verified Citations ({message.citations.length}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {message.citations.map((c, i) => (
                <CitationBadge
                  key={i}
                  citation={c}
                  index={i}
                  onClick={onCitationClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
