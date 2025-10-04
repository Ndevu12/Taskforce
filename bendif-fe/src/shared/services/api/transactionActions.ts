import axios from 'axios';
import { getAuthHeaders } from './APIHeader';
import { getApiUrl } from '../utils/env';

export const fetchTransactionsByUser = async () => {
  try {
    const API_URL = getApiUrl();
    const response = await axios.get(`${API_URL}/transactions/user`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Error fetching transactions:', error.response?.data?.error || error.message);
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    throw error;
  }
};

export const fetchTransactionById = async (transactionId: string) => {
  try {
    const response = await axios.get(`${API_URL}/transactions/${transactionId}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Error fetching transaction:', error.response?.data?.error || error.message);
    throw error;
  }
};

export const createTransaction = async (transaction: any) => {
  try {
    const response = await axios.post(`${API_URL}/transactions`, {
      account: transaction.account,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      budget: transaction.budget
    }, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Error creating transaction:', error.response?.data?.error || error.message);
    throw error;
  }
};

export const updateTransaction = async (transactionId: string, transaction: any) => {
  const response = await axios.put(`${API_URL}/transactions/${transactionId}`, {
    account: transaction.account,
    category: transaction.category,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date,
    budget: transaction.budget
  }, getAuthHeaders());
  return response.data;
};

export const deleteTransaction = async (transactionId: string) => {
  const response = await axios.delete(`${API_URL}/transactions/${transactionId}`, getAuthHeaders());
  return response.data;
};


export const fetchTransactionSummary = async (startDate?: string, endDate?: string) => {
  try {
    let url = `${API_URL}/transactions/summary`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Error fetching transaction summary:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    throw new Error(error.response?.data?.error || 'Failed to fetch transaction summary');
  }
};
