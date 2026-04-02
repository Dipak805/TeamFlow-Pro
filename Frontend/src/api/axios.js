import axios from 'axios';

const getBaseURL = () => {
  const envURL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_HOST;
  if (!envURL) return 'http://localhost:8080/api';
  
  // If it's a full URL (like https://...), use it, making sure it ends in /api
  let base = envURL;
  if (!base.startsWith('http')) base = `https://${base}`;
  
  // Ensure it doesn't end with a slash before adding /api
  base = base.replace(/\/$/, "");
  return base.endsWith('/api') ? base : `${base}/api`;
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ REQUEST interceptor — reads token fresh from localStorage on EVERY request.
// This prevents 403s caused by axios defaults being cleared on page refresh
// before AuthContext has a chance to restore the session.
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  err => Promise.reject(err)
);

// RESPONSE interceptor — redirect to login on 401
api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
