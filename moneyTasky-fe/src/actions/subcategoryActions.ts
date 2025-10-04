import axios from 'axios';
import { getAuthHeaders } from './APIHeader';


const API_URL = import.meta.env.VITE_BASE_URL;

export const fetchSubcategories = async (categoryId: string): Promise<{ name: string; _id: string }[]> => {
  const response = await axios.get(`${API_URL}/subcategories/category/name/${categoryId}`, getAuthHeaders());
  return response.data;
};

export const fetchSubcategoryById = async (subcategoryId: string): Promise<{ name: string; _id: string }> => {
  const response = await axios.get(`${API_URL}/subcategories/${subcategoryId}`, getAuthHeaders());
  return response.data;
};
