import axios, { AxiosError } from 'axios';
import { getErrorMessage, ApiError } from '../utils/errorHandler';

const API_URL = import.meta.env.VITE_BASE_URL;

export const register = async (name: string, email: string, password: string) => {
  try {
    const role = 'user';
    const response = await axios.post<{ message: string }>(`${API_URL}/auth`, { 
      name, email, password, role 
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw new Error(getErrorMessage(err));
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<{ token: string; message: string }>(
      `${API_URL}/auth/login`, 
      { email, password }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw new Error(getErrorMessage(err));
  }
};

export const logout = async (token: string) => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/auth/logout`, 
      {}, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw new Error(getErrorMessage(err));
  }
};
