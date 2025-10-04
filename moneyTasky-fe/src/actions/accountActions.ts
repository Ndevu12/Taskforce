import axios from 'axios';
import { AccountRequestData } from '../types/interfaces/Account';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

if (!API_URL) {
  throw new Error('VITE_BASE_URL is not defined');
}

export const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/accounts/user`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Error fetching accounts:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 401) {
      // Handle auth errors consistently
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("Session expired. Please login again.");
    }
    
    // Format error for better display
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch accounts');
  }
};

export const fetchAccountById = async (accountId: string) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/${accountId}`, getAuthHeaders());
    if (response.status === 401) {
      console.log("response", response);
      return "Unauthorized";
    }
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
  } catch (error: any) {
    // Handle specific error codes
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("You need to login first");
    }
    
    // Handle duplicate account names (409 Conflict)
    if (error.response?.status === 409) {
      throw new Error(error.response.data.error || "An account with this name already exists");
    }
    
    // Handle validation errors
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || "Invalid account data");
    }
    
    // General error handling
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Failed to create account'
    );
  }
};

export const updateAccount = async (account: any) => {
  try {
    console.log('Updating account with data:', account);
    
    const payload = {
      name: account.name, 
      balance: Number(account.balance), // Ensure balance is a number
      accountNumber: account.accountNumber,
      type: account.type,
      currency: account.currency,
      isActive: account.isActive === true || account.isActive === 'true' // Normalize boolean
    };
    
    const response = await axios.put(
      `${API_URL}/accounts/${account._id}`, 
      payload, 
      getAuthHeaders()
    );

    console.log('Server response:', response.data);
    return response.data;
  } catch (error: any) {
    // Handle specific error codes
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("You need to login first");
    }
    
    // Handle duplicate account names (409 Conflict)
    if (error.response?.status === 409) {
      throw new Error(error.response.data.error || "An account with this name already exists");
    }
    
    // Handle forbidden (no permission)
    if (error.response?.status === 403) {
      throw new Error(error.response.data.error || "You don't have permission to update this account");
    }
    
    // Handle validation errors
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || "Invalid account data");
    }
    
    // General error handling
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Failed to update account'
    );
  }
};

// Add a new function to update account balance only
export const updateAccountBalance = async (accountId: string, amount: number) => {
  try {
    console.log('Updating account balance:', { accountId, amount });
    
    const response = await axios.put(
      `${API_URL}/accounts/${accountId}/balance`, 
      { amount: Number(amount) }, // Ensure amount is a number
      getAuthHeaders()
    );

    console.log('Balance update response:', response.data);
    return response.data;
  } catch (error: any) {
    // Error handling similar to updateAccount
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("You need to login first");
    }
    
    if (error.response?.status === 403) {
      throw new Error(error.response.data.error || "You don't have permission to update this account balance");
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || "Invalid balance amount");
    }
    
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to update account balance'
    );
  }
};

export const deleteAccount = async (accountId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/accounts/${accountId}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    // Handle specific error codes
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("You need to login first");
    }
    
    // Handle forbidden (no permission)
    if (error.response?.status === 403) {
      throw new Error(error.response?.data?.error || "You don't have permission to delete this account");
    }
    
    // Handle account with transactions
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.error || "Cannot delete this account");
    }
    
    // Handle not found
    if (error.response?.status === 404) {
      throw new Error(error.response?.data?.error || "Account not found");
    }
    
    // General error handling
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to delete account'
    );
  }
};
