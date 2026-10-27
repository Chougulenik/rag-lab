import apiClient from './apiClient';

export const retrievalApi = {
  // Execute retrieval query with specified strategy
  search: ({ query, strategy = 'vector', k = 5, score_threshold = 0.0 }) =>
    apiClient.post('/retrieval/query', {
      query,
      strategy,
      k,
      score_threshold,
    }),
};
