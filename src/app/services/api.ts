import axios from "axios";

// This file is for client-side requests only
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token (client-side only)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      // window.location.href = "/sq/login";
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// Export the singleton instance
export default axiosClient;
