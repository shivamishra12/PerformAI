// Axios instance with auth interceptor
import axios from 'axios';

// In production, use the VITE_API_URL env variable; in dev, use Vite proxy (/api)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - attach JWT token
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('performai_user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('performai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
