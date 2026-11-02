import apiClient from './apiClient';

export function extractText(content) {
  if (content === null || content === undefined) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (!item) return '';
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
          if (typeof item.text === 'string') return item.text;
          if (typeof item.content === 'string') return item.content;
        }
        return '';
      })
      .join('');
  }
  if (typeof content === 'object') {
    if (typeof content.text === 'string') return content.text;
    if (typeof content.content === 'string') return content.content;
  }
  return String(content);
}

export const chatApi = {
  // Non-streaming completion
  sendMessage: async ({ message, history = [], strategy = 'vector', k = 4, temperature = 0.2 }) => {
    const res = await apiClient.post('/chat/completions', {
      message,
      history,
      strategy,
      k,
      temperature,
    });
    if (res.data && res.data.answer) {
      res.data.answer = extractText(res.data.answer);
    }
    return res;
  },

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
              const text = extractText(data.content !== undefined ? data.content : (data.text || data.token));
              if (text) {
                onToken(text);
              }
            } else if (data.type === 'citations' && onCitations) {
              onCitations(data.citations || []);
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
