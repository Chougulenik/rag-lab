import axios from 'axios';

// Base API client pointing to FastAPI backend (/api/v1)
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds for LLM / embedding queries
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    console.error('[API Error]:', message, error);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
