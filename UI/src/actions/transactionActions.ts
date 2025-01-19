import axios from 'axios';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

export const fetchTransactionsByUser = async (userId: string) => {
  const response = await axios.get(`${API_URL}/transactions/user`, getAuthHeaders());
  console.log(response.data);
  return response.data;
};

export const fetchTransactionById = async (transactionId: string) => {
  const response = await axios.get(`${API_URL}/transactions/${transactionId}`, getAuthHeaders());
  return response.data;
};

export const createTransaction = async (transaction: any) => {
  console.log(transaction);
  const response = await axios.post(`${API_URL}/transactions`, {
    account: transaction.account,
    category: transaction.category,
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date,
  }, getAuthHeaders());
  return response.data;
};

export const updateTransaction = async (transactionId: string, transaction: any) => {
  console.log({transaction})
  const response = await axios.put(`${API_URL}/transactions/${transactionId}`, {
    account: transaction.account._id,
    category: transaction.category_id,
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date,
  }, getAuthHeaders());
  return response.data;
};

export const deleteTransaction = async (transactionId: string) => {
  const response = await axios.delete(`${API_URL}/transactions/${transactionId}`, getAuthHeaders());
  return response.data;
};
