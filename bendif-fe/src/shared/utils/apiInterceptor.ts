import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { handleApiError, ErrorDetails } from './errorHandler';
import { logger } from './logger';
import { getToken, clearToken } from './tokenUtils';
import { getApiUrl } from './env';

// Create axios instance
const api = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to requests
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });

    return config;
  },
  (error) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
    });

    return response;
  },
  (error: AxiosError) => {
    const errorDetails = handleApiError(error);

    // Handle specific error types
    switch (errorDetails.type) {
      case 'auth':
        // Clear token and redirect to login for auth errors
        if (errorDetails.status === 401) {
          clearToken();
          window.location.href = '/login';
        }
        break;
      
      case 'network':
        // Handle network errors
        logger.warn('Network error detected', errorDetails);
        break;
      
      case 'server':
        // Handle server errors
        logger.error('Server error detected', errorDetails);
        break;
      
      default:
        logger.error('API error detected', errorDetails);
    }

    return Promise.reject(errorDetails);
  }
);

export default api;
