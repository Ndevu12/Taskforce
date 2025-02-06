import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

export const register = async (name: string, email: string, password: string) => {
  try {
    const role = 'user';
    const response = await axios.post(`${API_URL}/auth`, { name, email, password, role });
    if (response.status === 409) {
      return "Conflict";
    }

    if (response.status !== 201) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.message || 'Registration failed');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });

    if (response.status !== 200) {
      throw new Error(response.data.message || 'Login failed');
    }
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

    if (response.status !== 200) {
      throw new Error(response.data.message || 'Logout failed');
    }
    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || 'Logout failed');
  }
};
