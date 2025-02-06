
import axios from 'axios';
import { Budget, BudgetResponse } from '../interfaces/Budget';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

export const fetchBudgets = async (): Promise<BudgetResponse[] | string> => {
  const response = await axios.get(`${API_URL}/budgets/user`, getAuthHeaders());
  if (response.status === 401) {
    return "Unauthorized";
  }
  return response.data;
};

export const createBudget = async (budget: BudgetResponse): Promise<BudgetResponse> => {
  const response = await axios.post(`${API_URL}/budgets`, {
        category: budget.category._id,
        amount: budget.amount,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        currentSpent: budget.currentSpent,
        description: budget.description,
  }, getAuthHeaders());

  return response.data;
};

export const updateBudget = async (budget: BudgetResponse): Promise<Budget | string> => {
  const response = await axios.put(`${API_URL}/budgets/${budget._id}`, 
    {
        category: budget.category,
        amount: budget.amount,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        currentSpent: budget.currentSpent,
        description: budget.description,   
    }, 
    getAuthHeaders());

    if (response.status === 401) {
      return "Unauthorized";
    }
  return response.data;
};

export const deleteBudget = async (budgetId: string): Promise<void> => {
  await axios.delete(`${API_URL}/budgets/${budgetId}`, getAuthHeaders());
};