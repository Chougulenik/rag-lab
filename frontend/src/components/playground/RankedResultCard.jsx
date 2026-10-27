import React from 'react';
import Badge from '../common/Badge';
import { FileText, Hash } from 'lucide-react';

export default function RankedResultCard({ result, rank }) {
  const fileName = result.source ? result.source.split(/[/\\]/).pop() : `Document`;

  return (
    <div
      style={{
        background: 'var(--bg-glass-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        transition: 'transform 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant="accent">
            <Hash size={11} />
            Rank #{rank}
          </Badge>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
            <FileText size={15} color="var(--accent-secondary)" />
            {fileName}
          </div>
        </div>

        {result.score !== undefined && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--info)',
              background: 'var(--info-bg)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Score: {result.score.toFixed(4)}
          </span>
        )}
      </div>

      {/* Snippet Content */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          lineHeight: 1.55,
          color: 'var(--text-secondary)',
          background: 'var(--bg-primary)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          maxHeight: '160px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        {result.content}
      </div>

      {/* Metadata footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Length: {result.content?.length ?? 0} chars</span>
        <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {result.source}
        </span>
      </div>
    </div>
  );
}
