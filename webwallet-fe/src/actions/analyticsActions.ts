import axios from 'axios';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

if (!API_URL) {
    throw new Error('VITE_BASE_URL is not defined');
    }
/**
 * Fetch dashboard overview analytics data
 */
export const fetchDashboardOverview = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/dashboard-overview`, getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard overview:', error.response?.data || error.message);
    throw error;
  }
};
