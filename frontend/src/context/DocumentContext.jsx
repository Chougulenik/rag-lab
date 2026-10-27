import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { documentApi } from '../services/documentApi';

const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const stats = await documentApi.getStats();
      setSystemStats(stats);
    } catch (err) {
      console.warn('Could not fetch system stats:', err.message);
      // Fallback state if backend is still starting
      setSystemStats({ status: 'offline', document_count: 0 });
    }
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentApi.getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch knowledge base documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(
    async (formData) => {
      setError(null);
      const res = await documentApi.uploadDocument(formData);
      await fetchDocuments();
      await fetchStats();
      return res;
    },
    [fetchDocuments, fetchStats]
  );

  const reindexDocuments = useCallback(
    async (strategy = 'recursive') => {
      setReindexing(true);
      setError(null);
      try {
        const res = await documentApi.reindexDocuments(strategy);
        await fetchDocuments();
        await fetchStats();
        return res;
      } catch (err) {
        setError(err.message || 'Re-indexing failed');
        throw err;
      } finally {
        setReindexing(false);
      }
    },
    [fetchDocuments, fetchStats]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchStats();
    fetchDocuments();
  }, [fetchStats, fetchDocuments]);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        systemStats,
        loading,
        reindexing,
        error,
        fetchDocuments,
        fetchStats,
        uploadDocument,
        reindexDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
