import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000, // 5 second timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Please make sure the backend server is running');
    } else if (error.response?.status === 401) {
      // Handle unauthorized error
      console.error('Unauthorized: Please login again');
      // You might want to redirect to login page here
    }
    return Promise.reject(error);
  }
); 