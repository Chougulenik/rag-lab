import React, { useState } from 'react';
import { DocumentProvider, useDocuments } from './context/DocumentContext';
import { ChatProvider, useChat } from './context/ChatContext';
import AppShell from './components/layout/AppShell';
import ChatContainer from './components/chat/ChatContainer';
import DocumentTable from './components/documents/DocumentTable';
import StrategyComparison from './components/playground/StrategyComparison';

function MainApp() {
  const [activeTab, setActiveTab] = useState('chat');
  const { documents, systemStats, loading, reindexing, error, fetchDocuments, uploadDocument, reindexDocuments } = useDocuments();
  const {
    messages,
    sendMessage,
    clearChat,
    isStreaming,
    strategy,
    setStrategy,
    k,
    setK,
    temperature,
    setTemperature,
  } = useChat();

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} systemStats={systemStats}>
      {activeTab === 'chat' && (
        <ChatContainer
          messages={messages}
          onSendMessage={sendMessage}
          onClearChat={clearChat}
          isStreaming={isStreaming}
          strategy={strategy}
          onStrategyChange={setStrategy}
          k={k}
          onKChange={setK}
          temperature={temperature}
          onTemperatureChange={setTemperature}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentTable
          documents={documents}
          loading={loading}
          error={error}
          onRefresh={fetchDocuments}
          onUpload={uploadDocument}
          onReindex={reindexDocuments}
          reindexing={reindexing}
        />
      )}

      {activeTab === 'playground' && <StrategyComparison />}
    </AppShell>
  );
}

export default function App() {
  return (
    <DocumentProvider>
      <ChatProvider>
        <MainApp />
      </ChatProvider>
    </DocumentProvider>
  );
}
