import axios from 'axios';
import { BASE_URL } from '../lib/base-url';

// Set global axios defaults to always send cookies
axios.defaults.withCredentials = true;
console.log("🔧 Axios config loaded: withCredentials =", axios.defaults.withCredentials);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Always send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get 401 Unauthorized, the token might have expired
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Only redirect if not already on login/signup page
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Also set global interceptor for ALL axios instances (even ones imported as 'axios')
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
