import { getApiUrl } from './env';

/**
 * Safe API configuration utility
 * Provides a safe way to access API URLs without module initialization errors
 */

export const getAPIUrl = (): string => {
  try {
    return getApiUrl();
  } catch (error) {
    console.error('Failed to get API URL:', error);
    // Fallback to default
    return 'http://localhost:3000';
  }
};

export const API_URL = getAPIUrl();
