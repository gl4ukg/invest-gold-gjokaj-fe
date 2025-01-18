import axios from 'axios';

// Backend URL from the environment variables
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create a new instance of axios
const axiosInstance = axios.create({
  baseURL,  // Base URL of your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/de';
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Export the singleton instance
export default axiosInstance;
