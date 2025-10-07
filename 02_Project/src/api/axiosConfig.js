// src/api/client.js (or wherever your api file is)
import axios from 'axios';

const BASE_URL = import.meta.env.PROD 
  ? 'https://inyomee-app-production.up.railway.app/api'
  : 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;