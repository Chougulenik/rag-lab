import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { Layers, FileText } from 'lucide-react';

export default function ChunkViewerModal({ isOpen, onClose, document }) {
  if (!document) return null;

  const fileName = document.source ? document.source.split(/[/\\]/).pop() : 'Document';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inspect Indexed Chunks: ${fileName}`}
      maxWidth="780px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              Source: <code style={{ color: 'var(--text-primary)' }}>{document.source}</code>
            </span>
          </div>

          <Badge variant="accent">
            <Layers size={13} />
            {document.chunk_count ?? document.chunks?.length ?? 1} Chunks
          </Badge>
        </div>

        {/* Chunks List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: '450px',
            overflowY: 'auto',
          }}
        >
          {document.chunks && document.chunks.length > 0 ? (
            document.chunks.map((chunk, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--accent-secondary)',
                  }}
                >
                  <span>CHUNK #{idx + 1}</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {chunk.length ?? chunk.page_content?.length ?? 0} characters
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {typeof chunk === 'string' ? chunk : chunk.page_content}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No chunk details available for this document record.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
