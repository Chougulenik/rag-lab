import React, { useState } from 'react';
import { Search, Split, Zap, Clock, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import RankedResultCard from './RankedResultCard';
import { retrievalApi } from '../../services/retrievalApi';

export default function StrategyComparison() {
  const [query, setQuery] = useState('How much did Microsoft pay to acquire GitHub?');
  const [strategyA, setStrategyA] = useState('vector');
  const [strategyB, setStrategyB] = useState('rrf');
  const [k, setK] = useState(5);

  const [resultsA, setResultsA] = useState([]);
  const [resultsB, setResultsB] = useState([]);
  const [timeA, setTimeA] = useState(null);
  const [timeB, setTimeB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strategies = [
    { id: 'vector', name: 'Vector Similarity (Cosine)' },
    { id: 'multi_query', name: 'Multi-Query Expansion' },
    { id: 'rrf', name: 'Reciprocal Rank Fusion (RRF)' },
    { id: 'hybrid', name: 'Hybrid (BM25 + Vector)' },
    { id: 'rerank', name: 'Cross-Encoder Reranker' },
  ];

  const handleCompare = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Execute Strategy A
      const startA = performance.now();
      const resA = await retrievalApi.search({ query, strategy: strategyA, k });
      const elapsedA = Math.round(performance.now() - startA);
      setResultsA(resA.results || []);
      setTimeA(resA.latency_ms ?? elapsedA);

      // Execute Strategy B
      const startB = performance.now();
      const resB = await retrievalApi.search({ query, strategy: strategyB, k });
      const elapsedB = Math.round(performance.now() - startB);
      setResultsB(resB.results || []);
      setTimeB(resB.latency_ms ?? elapsedB);
    } catch (err) {
      setError(err.message || 'Retrieval comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Query Bar */}
      <form
        onSubmit={handleCompare}
        style={{
          background: 'var(--bg-glass-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Split size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Dual Retrieval Strategy Playground
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Execute identical queries across distinct RAG retrieval algorithms to benchmark ranking precision and latency.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-tertiary)',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                width: '100%',
              }}
            />
          </div>

          <Button type="submit" variant="primary" loading={loading} icon={Zap}>
            Benchmark Query
          </Button>
        </div>

        {/* Strategy Pickers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
              Strategy A:
            </span>
            <select
              value={strategyA}
              onChange={(e) => setStrategyA(e.target.value)}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.75rem',
                fontSize: '0.85rem',
              }}
            >
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a855f7' }}>
              Strategy B:
            </span>
            <select
              value={strategyB}
              onChange={(e) => setStrategyB(e.target.value)}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.75rem',
                fontSize: '0.85rem',
              }}
            >
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Top-K:</span>
            <select
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.5rem',
                fontSize: '0.85rem',
              }}
            >
              {[3, 5, 8, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--error-bg)',
            color: 'var(--error)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Column A */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-secondary)' }}>
                {strategies.find((s) => s.id === strategyA)?.name}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {resultsA.length} Chunks Retrieved
              </div>
            </div>

            {timeA !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                <Clock size={14} />
                {timeA} ms
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resultsA.length > 0 ? (
              resultsA.map((res, i) => (
                <RankedResultCard key={i} result={res} rank={i + 1} />
              ))
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-glass-card)', borderRadius: 'var(--radius-md)' }}>
                Execute a benchmark query to view Strategy A ranking results.
              </div>
            )}
          </div>
        </div>

        {/* Column B */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#c084fc' }}>
                {strategies.find((s) => s.id === strategyB)?.name}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {resultsB.length} Chunks Retrieved
              </div>
            </div>

            {timeB !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#c084fc' }}>
                <Clock size={14} />
                {timeB} ms
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resultsB.length > 0 ? (
              resultsB.map((res, i) => (
                <RankedResultCard key={i} result={res} rank={i + 1} />
              ))
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-glass-card)', borderRadius: 'var(--radius-md)' }}>
                Execute a benchmark query to view Strategy B ranking results.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
