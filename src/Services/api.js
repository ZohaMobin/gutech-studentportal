import axios from 'axios';
import { useAuth } from './components/AuthContext'; // Import the useAuth hook

// Create an axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Use window location as a fallback, but prefer React Router navigation
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;