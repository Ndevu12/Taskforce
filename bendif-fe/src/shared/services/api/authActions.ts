import api from '../utils/apiInterceptor';
import { getErrorMessage, ApiError, handleApiError } from '../utils/errorHandler';
import { getApiUrl } from '../utils/env';

export const register = async (name: string, email: string, password: string) => {
  try {
    const role = 'USER';
    const API_URL = getApiUrl();
    const response = await api.post<{ message: string }>(`${API_URL}/auth`, { 
      name, email, password, role 
    });
    return response.data;
  } catch (error) {
    const errorDetails = handleApiError(error);
    throw new Error(errorDetails.message);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const API_URL = getApiUrl();
    const response = await api.post<{ token: string; message: string }>(
      `${API_URL}/auth/login`, 
      { email, password }
    );
    return response.data;
  } catch (error) {
    const errorDetails = handleApiError(error);
    throw new Error(errorDetails.message);
  }
};

export const logout = async (token: string) => {
  try {
    const API_URL = getApiUrl();
    const response = await api.post<{ message: string }>(
      `${API_URL}/auth/logout`, 
      {}
    );
    return response.data;
  } catch (error) {
    const errorDetails = handleApiError(error);
    throw new Error(errorDetails.message);
  }
};

// Add refresh token functionality if your backend supports it
export const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  
  try {
    const API_URL = getApiUrl();
    const response = await api.post(`${API_URL}/auth/refresh`, { refreshToken });
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return true;
    }
    return false;
  } catch (error) {
    const errorDetails = handleApiError(error);
    console.error('Failed to refresh token:', errorDetails.message);
    return false;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const API_URL = getApiUrl();
    const response = await api.post<{ message: string }>(
      `${API_URL}/auth/request-password-reset`,
      { email }
    );
    return response.data;
  } catch (error) {
    const errorDetails = handleApiError(error);
    throw new Error(errorDetails.message);
  }
};

export const resetPassword = async (userId: string, token: string, newPassword: string) => {
  try {
    const API_URL = getApiUrl();
    const response = await api.post<{ message: string }>(
      `${API_URL}/auth/reset-password`,
      { userId, token, newPassword }
    );
    return response.data;
  } catch (error) {
    const errorDetails = handleApiError(error);
    throw new Error(errorDetails.message);
  }
};
