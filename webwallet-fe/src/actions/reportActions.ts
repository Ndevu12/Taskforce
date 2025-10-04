import axios from 'axios';
import { IReport } from '../types/interfaces/Report';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

if (!API_URL) {
    throw new Error('VITE_BASE_URL is not defined');
}

/**
 * Fetch all reports for logged in user
 */
export const fetchReports = async (): Promise<IReport[] | string> => {
  try {
    const response = await axios.get(`${API_URL}/reports/user`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Error fetching reports:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return 'Unauthorized';
    }
    throw new Error(error.response?.data?.error || 'Failed to fetch reports');
  }
};

// Remove generateTransactionReport method

// Remove generateBudgetReport method

/**
 * Get report details
 */
export const getReportDetails = async (reportId: string): Promise<IReport | string> => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/${reportId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching report details:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return 'Unauthorized';
    }
    throw new Error(error.response?.data?.error || 'Failed to fetch report details');
  }
};

/**
 * Delete a report
 */
export const deleteReport = async (reportId: string): Promise<boolean | string> => {
  try {
    await axios.delete(
      `${API_URL}/reports/${reportId}`,
      getAuthHeaders()
    );
    return true;
  } catch (error: any) {
    console.error('Error deleting report:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return 'Unauthorized';
    }
    throw new Error(error.response?.data?.error || 'Failed to delete report');
  }
};

/**
 * Get reports analytics
 */
export const fetchReportAnalytics = async (): Promise<any | string> => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/analytics`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching report analytics:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return 'Unauthorized';
    }
    throw new Error(error.response?.data?.error || 'Failed to fetch report analytics');
  }
};

