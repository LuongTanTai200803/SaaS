// src/api/axiosClient.ts
import axios from 'axios';
import { API_BASE_URL } from '../config'; // Import API_BASE_URL

const ht = axios.create({
  baseURL: API_BASE_URL, // Sử dụng biến môi trường
  headers: { 'Content-Type': 'application/json' },
});

ht.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => Promise.reject(error)
);

ht.interceptors.response.use(
  (response) => (response && response.data ? response.data : response),
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('access_token');
      window.dispatchEvent(new Event('auth-changed'));
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default ht;