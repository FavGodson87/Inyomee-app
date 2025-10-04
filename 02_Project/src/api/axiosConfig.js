import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Development - localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }
    // Production - same domain
    return '/api';
  }
  return '/api';
};

const BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000, // Increased timeout for Render
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Request Failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;