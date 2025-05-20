import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const axiosServer = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
axiosServer.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // For server-side requests, we should throw an error that can be handled by the page
      throw new Error('Unauthorized');
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosServer;
