import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

export default function DocumentUploadModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [strategy, setStrategy] = useState('recursive');
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('strategy', strategy);
    formData.append('chunk_size', chunkSize.toString());
    formData.append('chunk_overlap', chunkOverlap.toString());

    try {
      await onUpload(formData);
      onClose();
      setFile(null);
    } catch (err) {
      setError(err.message || 'File upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ingest Document into ChromaDB" maxWidth="540px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Drag/Drop Box */}
        <label
          style={{
            border: '2px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgba(30, 41, 59, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'border-color 0.2s',
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) setFile(dropped);
          }}
        >
          <input
            type="file"
            accept=".txt,.md,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UploadCloud size={24} color="var(--accent-secondary)" />
          </div>

          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              <File size={16} />
              <span style={{ fontWeight: 600 }}>{file.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          ) : (
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Click to browse or drag and drop document
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Supported formats: TXT, MD, PDF
              </p>
            </div>
          )}
        </label>

        {/* Chunking Strategy Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Chunking Strategy:
          </label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem 0.75rem',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          >
            <option value="recursive">Recursive Character (Fast & Balanced)</option>
            <option value="semantic">Semantic Similarity (Embedding Breakpoints)</option>
            <option value="agentic">Agentic Chunking (LLM Boundary Detection)</option>
          </select>
        </div>

        {/* Chunk Size & Overlap */}
        {strategy === 'recursive' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Chunk Size (chars):
              </label>
              <input
                type="number"
                min={200}
                max={4000}
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Chunk Overlap (chars):
              </label>
              <input
                type="number"
                min={0}
                max={500}
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--error)',
              fontSize: '0.85rem',
              background: 'var(--error-bg)',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={UploadCloud}>
            Ingest & Embed
          </Button>
        </div>
      </form>
    </Modal>
  );
}
