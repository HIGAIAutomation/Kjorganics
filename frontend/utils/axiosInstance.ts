// utils/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend base URL (not frontend port)
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
