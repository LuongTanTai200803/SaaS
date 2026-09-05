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
  (response) => response.data,
  (error) => {
    try {
      if (error.response) {
        console.error('API response error:', {
          status: error.response.status,
          url: error.config?.url,
          data: error.response.data,
        });

        if (error.response.status >= 500) {
          alert('Lỗi máy chủ (500). Vui lòng thử lại sau hoặc kiểm tra backend.');
        }
      } else if (error.request) {
        console.error('No response from server (network error):', {
          url: error.config?.url,
          message: error.message,
        });

        alert('Không kết nối được tới server. Kiểm tra backend hoặc mạng.');
      } else {
        console.error('Request setup error:', error.message);
      }
    } catch (logErr) {
      console.error('Error while logging axios error', logErr);
    }

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
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