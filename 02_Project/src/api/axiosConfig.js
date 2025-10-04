import axios from 'axios';

// Simple fix - use relative path in production
const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000/api'
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;