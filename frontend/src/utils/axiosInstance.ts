// utils/axiosInstance.ts
import axios from 'axios';

// Ensure baseURL is properly formatted without trailing slashes
const baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Clean up the URL to prevent formatting issues
    if (config.url) {
      // Remove any special characters and ensure proper URL format
      config.url = config.url
        .replace(/[;]/g, '') // Remove any semicolons
        .replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
      
      // Log the complete URL for debugging
      const fullUrl = `${config.baseURL}/${config.url}`;
      console.log('Making request to:', fullUrl);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the full error details
    console.log('Full error object:', {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      } : 'No response',
    });

    // Network Error
    if (error.code === 'ECONNABORTED') {
      error.customMessage = 'Request timed out. Please try again.';
    } else if (!error.response) {
      error.customMessage = 'Network error. Please check your connection and make sure the backend server is running.';
    }
    // Server Error
    else {
      error.customMessage = error.response.data?.message || 'An unexpected error occurred';
    }
    switch (error.response.status) {
      case 400:
        error.customMessage = error.response.data?.message || 'Invalid request';
        break;
      case 401:
        error.customMessage = 'Authentication failed - please log in again';
        break;
      case 403:
        error.customMessage = 'Access denied - insufficient permissions';
        break;
      case 404:
        error.customMessage = 'Resource not found';
        break;
      case 500:
        error.customMessage = 'Server error - please try again later';
        break;
      default:
        error.customMessage = error.response.data?.message || 'An error occurred';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
