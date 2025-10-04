import { AxiosError } from 'axios';
import { logger } from './logger';

export interface ApiError {
  error?: string;
  message?: string;
  code?: string;
  status?: number;
  errors?: any[];
}

export interface ErrorDetails {
  message: string;
  code?: string;
  status?: number;
  type: 'network' | 'server' | 'client' | 'auth' | 'validation' | 'unknown';
  originalError?: any;
}

export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please login again.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  }
  
  if (error.request) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

export const getErrorDetails = (error: any): ErrorDetails => {
  const message = getErrorMessage(error);
  let type: ErrorDetails['type'] = 'unknown';
  let code: string | undefined;

  if (error.response) {
    const status = error.response.status;
    code = error.response.data?.code;
    
    if (status >= 500) {
      type = 'server';
    } else if (status === 401 || status === 403) {
      type = 'auth';
    } else if (status === 400 || status === 422) {
      type = 'validation';
    } else if (status >= 400 && status < 500) {
      type = 'client';
    }
  } else if (error.request) {
    type = 'network';
  }

  return {
    message,
    code,
    status: error.response?.status,
    type,
    originalError: error,
  };
};

export const handleApiError = (error: any): ErrorDetails => {
  const errorDetails = getErrorDetails(error);
  
  // Log the error
  logger.error('API Error occurred', {
    message: errorDetails.message,
    type: errorDetails.type,
    status: errorDetails.status,
    code: errorDetails.code,
    url: error.config?.url,
    method: error.config?.method,
  });

  return errorDetails;
};
