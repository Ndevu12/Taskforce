import axios from 'axios';
import { BudgetResponse } from '../types/interfaces/Budget';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

export const fetchBudgets = async (): Promise<BudgetResponse[]> => {
  try {
    console.log('Fetching budgets from API');
    const response = await axios.get(`${API_URL}/budgets/user`, getAuthHeaders());
    console.log('Budgets fetched successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching budgets:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("Session expired. Please login again.");
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch budgets');
  }
};

export const fetchBudgetById = async (budgetId: string): Promise<BudgetResponse> => {
  try {
    const response = await axios.get(`${API_URL}/budgets/${budgetId}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("Session expired. Please login again.");
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch budget');
  }
};

export const createBudget = async (budget: BudgetResponse): Promise<BudgetResponse> => {
  try {
    console.log('Creating budget with data:', budget);
    
    const payload = {
      category: budget.category._id,
      amount: Number(budget.amount),
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate,
      currentSpent: Number(budget.currentSpent),
      description: budget.description,
      notificationThreshold: budget.notificationThreshold || 80
    };
    
    const response = await axios.post(
      `${API_URL}/budgets`,
      payload,
      getAuthHeaders()
    );

    console.log('Budget created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating budget:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("You need to login first");
    }
    
    if (error.response?.status === 409) {
      throw new Error(error.response.data.error || "A budget with this description already exists");
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || "Invalid budget data");
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Failed to create budget');
  }
};

export const updateBudget = async (budget: BudgetResponse): Promise<BudgetResponse> => {
  try {
    console.log('Updating budget with data:', budget);
    
    // Ensure proper data formatting before sending to API
    const payload = {
      category: budget.category._id,
      amount: Number(budget.amount),
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate,
      currentSpent: Number(budget.currentSpent),
      description: budget.description,
      notificationThreshold: budget.notificationThreshold || 80
    };
    
    const response = await axios.put(
      `${API_URL}/budgets/${budget._id}`, 
      payload, 
      getAuthHeaders()
    );

    console.log('Budget updated successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating budget:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("You need to login first");
    }
    
    if (error.response?.status === 409) {
      throw new Error(error.response.data.error || "A budget with this description already exists");
    }
    
    if (error.response?.status === 403) {
      throw new Error(error.response.data.error || "You don't have permission to update this budget");
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || "Invalid budget data");
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Failed to update budget');
  }
};

export const deleteBudget = async (budgetId: string): Promise<void> => {
  try {
    console.log('Deleting budget:', budgetId);
    await axios.delete(`${API_URL}/budgets/${budgetId}`, getAuthHeaders());
    console.log('Budget deleted successfully');
  } catch (error: any) {
    console.error('Error deleting budget:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("You need to login first");
    }
    
    if (error.response?.status === 403) {
      throw new Error(error.response?.data?.error || "You don't have permission to delete this budget");
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.error || "Cannot delete budget with associated transactions");
    }
    
    if (error.response?.status === 404) {
      throw new Error(error.response?.data?.error || "Budget not found");
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Failed to delete budget');
  }
};