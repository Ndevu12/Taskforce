import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth`, { name, email, password });
    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || 'Registration failed');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};

export const logout = async (token: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || 'Logout failed');
  }
};
