import apiClient from './apiClient';

export const chatApi = {
  // Non-streaming completion
  sendMessage: ({ message, history = [], strategy = 'vector', k = 4, temperature = 0.2 }) =>
    apiClient.post('/chat/completions', {
      message,
      history,
      strategy,
      k,
      temperature,
    }),

  // Streaming completion using Fetch ReadableStream
  streamMessage: async ({
    message,
    history = [],
    strategy = 'vector',
    k = 4,
    temperature = 0.2,
    onToken,
    onCitations,
    onError,
    onComplete,
    signal,
  }) => {
    try {
      const response = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history,
          strategy,
          k,
          temperature,
        }),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP Error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.type === 'token' && onToken) {
              onToken(data.content);
            } else if (data.type === 'citations' && onCitations) {
              onCitations(data.citations);
            } else if (data.type === 'error' && onError) {
              onError(data.error);
            }
          } catch (err) {
            console.warn('Failed to parse SSE JSON line:', jsonStr, err);
          }
        }
      }

      if (onComplete) onComplete();
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        console.error('Stream failure:', err);
        if (onError) onError(err.message || 'Stream connection failed');
      }
    }
  },
};
