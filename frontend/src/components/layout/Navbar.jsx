import React from 'react';
import { MessageSquare, Database, Search, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import Badge from '../common/Badge';

export default function Navbar({ activeTab, onTabChange, systemStats }) {
  const tabs = [
    { id: 'chat', label: 'Conversational RAG', icon: MessageSquare },
    { id: 'documents', label: 'Knowledge Base', icon: Database },
    { id: 'playground', label: 'Retrieval Playground', icon: Search },
  ];

  const isConnected = systemStats?.status === 'healthy' || systemStats?.status === 'online';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand logo & title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)',
          }}
        >
          <Cpu size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              RAG
            </span>
            <span
              style={{
                fontWeight: 600,
                fontSize: '0.8rem',
                color: 'var(--accent-secondary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Enterprise
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Advanced Multi-Strategy Retrieval Platform
          </span>
        </div>
      </div>

      {/* Center Nav Tabs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'rgba(30, 41, 59, 0.5)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Icon size={16} color={isActive ? 'var(--accent-secondary)' : 'currentColor'} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Stats & Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {systemStats ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant={isConnected ? 'success' : 'warning'}>
              {isConnected ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
              {isConnected ? 'ChromaDB Active' : 'Connecting'}
            </Badge>
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-tertiary)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {systemStats.chunk_count ?? 0} Chunks ({systemStats.document_count ?? 0} Docs)
            </span>
          </div>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            System Initializing...
          </span>
        )}
      </div>
    </header>
  );
}
