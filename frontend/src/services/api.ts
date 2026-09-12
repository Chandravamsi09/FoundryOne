import axios from 'axios';
import { TOKEN_KEY } from '../types/constants';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401s if it's not the login endpoint itself
    const isLoginEndpoint = error.config && error.config.url && error.config.url.includes('/login');
    if (error.response && error.response.status === 401 && !isLoginEndpoint) {
      // Handle unauthorized (e.g., token expired)
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/role-selection';
    }
    return Promise.reject(error);
  }
);

export default api;