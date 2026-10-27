import React from 'react';
import { BookOpen } from 'lucide-react';

export default function CitationBadge({ citation, index, onClick }) {
  // Extract short file name (e.g., "docs/tesla.txt" -> "tesla.txt")
  const sourceName = citation.source ? citation.source.split(/[/\\]/).pop() : `Source ${index + 1}`;

  return (
    <button
      onClick={() => onClick(citation, index)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.6rem',
        margin: '0.2rem 0.3rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        color: '#a5b4fc',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      title={`View verified excerpt from ${sourceName}`}
    >
      <BookOpen size={12} />
      <span>[{index + 1}] {sourceName}</span>
      {citation.score !== undefined && (
        <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>
          ({Math.round(citation.score * 100)}%)
        </span>
      )}
    </button>
  );
}
