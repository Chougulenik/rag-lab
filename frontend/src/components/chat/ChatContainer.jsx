import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, ArrowDown, Sparkles } from 'lucide-react';
import StrategySelector from './StrategySelector';
import MessageBubble from './MessageBubble';
import CitationModal from './CitationModal';
import Button from '../common/Button';

export default function ChatContainer({
  messages,
  onSendMessage,
  onClearChat,
  isStreaming,
  strategy,
  onStrategyChange,
  k,
  onKChange,
  temperature,
  onTemperatureChange,
}) {
  const [input, setInput] = useState('');
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [citationIndex, setCitationIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const sampleQuestions = [
    "How much did Microsoft pay to acquire GitHub?",
    "What was NVIDIA's first graphics accelerator called?",
    "In what year did Tesla begin production of the Roadster?",
    "How does Tesla make money across its business segments?",
    "What was the name of the autonomous spaceport drone ship that achieved the first sea landing?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCitationClick = (citation, index) => {
    setSelectedCitation(citation);
    setCitationIndex(index);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        position: 'relative',
      }}
    >
      {/* Strategy and hyperparameter tuning bar */}
      <StrategySelector
        strategy={strategy}
        onStrategyChange={onStrategyChange}
        k={k}
        onKChange={onKChange}
        temperature={temperature}
        onTemperatureChange={onTemperatureChange}
      />

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: 'var(--accent-glow)',
              }}
            >
              <Sparkles size={32} color="#ffffff" />
            </div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Enterprise Document Intelligence
            </h2>
            <p style={{ maxWidth: '520px', fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Ask questions grounded exclusively in your indexed knowledge base. Verified source citations and multi-strategy retrieval ensure maximum accuracy.
            </p>

            {/* Quick Prompts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '540px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Try asking:
              </span>
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  style={{
                    textAlign: 'left',
                    background: 'var(--bg-glass-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 1rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg}
              onCitationClick={handleCitationClick}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div
        style={{
          marginTop: '1rem',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem 1rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question (Shift+Enter for newline)..."
            disabled={isStreaming}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              resize: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearChat}
                disabled={isStreaming}
                title="Clear conversation"
              >
                <Trash2 size={16} />
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim() || isStreaming}
              loading={isStreaming}
              icon={Send}
            >
              Send
            </Button>
          </div>
        </form>
      </div>

      {/* Citation Inspector Modal */}
      <CitationModal
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
        citation={selectedCitation}
        index={citationIndex}
      />
    </div>
  );
}
