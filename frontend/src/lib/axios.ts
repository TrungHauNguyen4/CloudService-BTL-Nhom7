import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5023/api', // Backend port from docker-compose
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động nhét Token vào mọi request gửi lên Backend
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Xử lý khi Backend từ chối Token (Hết hạn hoặc sai token)
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    if (typeof window !== 'undefined') {
      Cookies.remove('token'); 
      Cookies.remove('token', { path: '/' }); 
      Cookies.remove('token', { path: '/dashboard' }); 
      Cookies.remove('token', { path: '/', domain: window.location.hostname });
      window.location.href = '/dang-nhap'; 
    }
  }
  return Promise.reject(error);
});

export default apiClient;
