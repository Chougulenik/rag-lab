import React from 'react';
import { Sliders, HelpCircle } from 'lucide-react';

export default function StrategySelector({
  strategy,
  onStrategyChange,
  k,
  onKChange,
  temperature,
  onTemperatureChange,
}) {
  const strategies = [
    { id: 'vector', name: 'Vector Similarity', desc: 'Fast cosine distance on ChromaDB embeddings' },
    { id: 'multi_query', name: 'Multi-Query Expansion', desc: 'LLM generates 3 variations to cover semantic angles' },
    { id: 'rrf', name: 'Reciprocal Rank Fusion', desc: 'Ranks and merges multi-query search results' },
    { id: 'hybrid', name: 'Hybrid (BM25 + Vector)', desc: 'Combines sparse keyword matching with dense semantics' },
    { id: 'rerank', name: 'Cross-Encoder Reranker', desc: 'Re-scores candidate chunks with fine-grained cross-attention' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
      }}
    >
      {/* Strategy selector dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Sliders size={16} color="var(--accent-secondary)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Retrieval Strategy:
        </span>
        <select
          value={strategy}
          onChange={(e) => onStrategyChange(e.target.value)}
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.75rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {strategies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <span
          title={strategies.find((s) => s.id === strategy)?.desc}
          style={{ cursor: 'help', color: 'var(--text-muted)' }}
        >
          <HelpCircle size={15} />
        </span>
      </div>

      {/* Numerical controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Top-K */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top-K Chunks:</span>
          <select
            value={k}
            onChange={(e) => onKChange(Number(e.target.value))}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.3rem 0.5rem',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {[2, 3, 4, 5, 8, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Temp:</span>
          <select
            value={temperature}
            onChange={(e) => onTemperatureChange(Number(e.target.value))}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.3rem 0.5rem',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {[0.0, 0.2, 0.5, 0.7, 1.0].map((t) => (
              <option key={t} value={t}>
                {t.toFixed(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
