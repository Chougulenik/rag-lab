import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { FileText, Award } from 'lucide-react';

export default function CitationModal({ isOpen, onClose, citation, index }) {
  if (!citation) return null;

  const fileName = citation.source ? citation.source.split(/[/\\]/).pop() : `Source ${index + 1}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Citation Evidence [${index + 1}]: ${fileName}`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Metadata stats row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-tertiary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} color="var(--accent-secondary)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Source Path:
            </span>
            <code style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              {citation.source}
            </code>
          </div>

          {citation.score !== undefined && (
            <Badge variant="accent">
              <Award size={12} />
              Relevance: {Math.round(citation.score * 100)}%
            </Badge>
          )}
        </div>

        {/* Chunk Text content */}
        <div>
          <span
            style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '0.4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Retrieved Text Chunk
          </span>
          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              maxHeight: '360px',
              overflowY: 'auto',
            }}
          >
            {citation.content}
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          Retrieved via ChromaDB vector index cosine distance
        </div>
      </div>
    </Modal>
  );
}
