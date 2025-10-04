import axios from 'axios';

const BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:4000/api'  // Development: full URL to backend
  : 'https://inyomee-app.onrender.com';  // Production: relative path (same domain)

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // He's missing this!
});

export default api;