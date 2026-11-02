import React, { useState } from 'react';
import { FileText, Upload, RefreshCw, Eye, Search, Layers, Database, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import DocumentUploadModal from './DocumentUploadModal';
import ChunkViewerModal from './ChunkViewerModal';

export default function DocumentTable({
  documents = [],
  loading = false,
  error = null,
  onRefresh,
  onUpload,
  onReindex,
  onDelete,
  reindexing = false,
}) {
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deletePhysicalFile, setDeletePhysicalFile] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!docToDelete || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(docToDelete.source, deletePhysicalFile);
      setDocToDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const term = search.toLowerCase();
    return (
      doc.source?.toLowerCase().includes(term) ||
      doc.filename?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Action Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Knowledge Base Catalog
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Documents loaded and persisted inside the ChromaDB vector store.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onRefresh && (
            <Button
              variant="secondary"
              icon={RefreshCw}
              loading={loading}
              onClick={onRefresh}
              size="md"
            >
              Refresh
            </Button>
          )}

          <Button
            variant="outline"
            icon={RefreshCw}
            loading={reindexing}
            onClick={onReindex}
            size="md"
          >
            Re-index Docs Directory
          </Button>

          <Button
            variant="primary"
            icon={Upload}
            onClick={() => setIsUploadOpen(true)}
            size="md"
          >
            Upload New File
          </Button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Filter and stats row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'var(--bg-glass-card)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-tertiary)',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            width: '320px',
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filter documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              width: '100%',
            }}
          />
        </div>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredDocs.length}</strong> of {documents.length} sources
        </span>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--bg-glass-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ padding: '0.9rem 1.25rem' }}>Document Source</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Chunks</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Characters</th>
              <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading knowledge base records...
                </td>
              </tr>
            ) : filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Database size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                  <p>No documents found matching the filter.</p>
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc, idx) => {
                const fileName = doc.source ? doc.source.split(/[/\\]/).pop() : `Document ${idx + 1}`;
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(99, 102, 241, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FileText size={18} color="var(--accent-secondary)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                            {fileName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {doc.source}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Badge variant="accent">
                        <Layers size={12} />
                        {doc.chunk_count ?? doc.chunks?.length ?? 1}
                      </Badge>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {doc.total_chars?.toLocaleString() ?? '—'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => setSelectedDoc(doc)}
                          title="Inspect chunks"
                        >
                          Inspect Chunks
                        </Button>
                        {onDelete && (
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => {
                              setDocToDelete(doc);
                              setDeletePhysicalFile(false);
                            }}
                            title="Delete document and chunks"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(docToDelete)}
        onClose={() => !deleting && setDocToDelete(null)}
        title="Confirm Document Deletion"
        maxWidth="500px"
      >
        {docToDelete && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--error-bg)',
                  color: 'var(--error)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Delete "{docToDelete.source ? docToDelete.source.split(/[/\\]/).pop() : docToDelete.filename}"?
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  This will permanently remove all <strong>{docToDelete.chunk_count ?? docToDelete.chunks?.length ?? 1} chunks</strong> ({docToDelete.total_chars?.toLocaleString() ?? 0} characters) from the ChromaDB vector database.
                </p>
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <input
                type="checkbox"
                checked={deletePhysicalFile}
                onChange={(e) => setDeletePhysicalFile(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Also delete source file from local <code>docs/</code> folder</span>
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="secondary"
                onClick={() => setDocToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                icon={Trash2}
                loading={deleting}
                onClick={handleConfirmDelete}
              >
                Delete Document
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={onUpload}
      />

      {/* Chunk Viewer Modal */}
      <ChunkViewerModal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        document={selectedDoc}
        onDelete={onDelete ? (doc) => setDocToDelete(doc) : undefined}
      />
    </div>
  );
}
