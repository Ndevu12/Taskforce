import axios from 'axios';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

export const fetchCategories = async (): Promise<{ name: string; _id: string }[]> => {
  const response = await axios.get(`${API_URL}/categories`, getAuthHeaders());
  return response.data;
};

export const fetchCategoryById = async (categoryId: string): Promise<{ name: string; _id: string }> => {
  const response = await axios.get(`${API_URL}/categories/${categoryId}`, getAuthHeaders());
  return response.data;
};
