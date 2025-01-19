import axios from 'axios';
import { AccountRequestData } from '../interfaces/Account';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

if (!API_URL) {
    throw new Error('VITE_BASE_URL is not defined');
    }

export const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/accounts/user`, getAuthHeaders());
    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || 'Failed to fetch accounts');
  }
};

export const fetchAccountById = async (accountId: string) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/${accountId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || 'Failed to fetch account');
  }
};

export const createAccount = async (account: AccountRequestData) => {
  try {
    const response = await axios.post(`${API_URL}/accounts`, {
        name: account.name, 
        balance: account.balance, 
        accountNumber: account.accountNumber,
        type: account.type,
        currency: account.currency,
        isActive: account.isActive
    }, getAuthHeaders());

    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to create account');
  }
};

export const updateAccount = async (account: any) => {
  try {
    const response = await axios.put(`${API_URL}/accounts/${account._id}`, 
        {
            name: account.name, 
            balance: account.balance, 
            accountNumber: account.accountNumber,
            type: account.type,
            currency: account.currency,
            isActive: account.isActive
        }, getAuthHeaders());

    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || 'Failed to update account');
  }
};

export const deleteAccount = async (accountId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/accounts/${accountId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err.response?.data?.message || 'Failed to delete account');
  }
};
