import axios from 'axios';

const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000/api'
  : 'https://inyomee-app-production.up.railway.app/api';  // ← Add full URL

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;