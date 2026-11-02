import apiClient from './apiClient';

export const documentApi = {
  // Fetch system health & document statistics
  getStats: () => apiClient.get('/health/stats'),

  // List all indexed documents & summary
  getDocuments: () => apiClient.get('/documents'),

  // Upload file with selected chunking strategy
  uploadDocument: (formData) =>
    apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Re-index all files in docs folder
  reindexDocuments: (chunkingStrategy = 'recursive', chunkSize = 1000, chunkOverlap = 100) =>
    apiClient.post('/documents/reindex', {
      strategy: chunkingStrategy,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
    }),

  // Delete all chunks for a document from the vector store
  deleteDocument: (source, deleteFile = false) =>
    apiClient.delete('/documents', {
      params: { source, delete_file: deleteFile },
    }),
};
