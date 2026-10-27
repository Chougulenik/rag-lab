import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { chatApi } from '../services/chatApi';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [strategy, setStrategy] = useState('vector');
  const [k, setK] = useState(4);
  const [temperature, setTemperature] = useState(0.2);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isStreaming) return;

      const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMessage = {
        role: 'user',
        content: text,
        timestamp: userTimestamp,
      };

      const assistantPlaceholder = {
        role: 'assistant',
        content: '',
        citations: [],
        timestamp: userTimestamp,
        isStreaming: true,
      };

      // Append user message + empty assistant placeholder
      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsStreaming(true);

      abortControllerRef.current = new AbortController();

      // Convert prior messages to simple history objects for context rewriting
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let accumulatedContent = '';

      await chatApi.streamMessage({
        message: text,
        history,
        strategy,
        k,
        temperature,
        signal: abortControllerRef.current.signal,
        onToken: (token) => {
          accumulatedContent += token;
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.role === 'assistant') {
              copy[copy.length - 1] = {
                ...last,
                content: accumulatedContent,
              };
            }
            return copy;
          });
        },
        onCitations: (citations) => {
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.role === 'assistant') {
              copy[copy.length - 1] = {
                ...last,
                citations,
              };
            }
            return copy;
          });
        },
        onError: (errMessage) => {
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.role === 'assistant') {
              copy[copy.length - 1] = {
                ...last,
                content: accumulatedContent
                  ? `${accumulatedContent}\n\n⚠️ Error during streaming: ${errMessage}`
                  : `⚠️ Failed to get response: ${errMessage}`,
                isStreaming: false,
              };
            }
            return copy;
          });
          setIsStreaming(false);
        },
        onComplete: () => {
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.role === 'assistant') {
              copy[copy.length - 1] = {
                ...last,
                isStreaming: false,
              };
            }
            return copy;
          });
          setIsStreaming(false);
        },
      });
    },
    [isStreaming, messages, strategy, k, temperature]
  );

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setIsStreaming(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
