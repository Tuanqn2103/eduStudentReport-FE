import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('userProfile');

        if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else if (currentPath.startsWith('/teacher')) {
          window.location.href = '/teacher/login';
        } else if (currentPath.startsWith('/parent')) {
          window.location.href = '/parent/login';
        } else {
          window.location.href = '/'; // Mặc định
        }
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;