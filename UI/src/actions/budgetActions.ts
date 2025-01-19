
import axios from 'axios';
import { Budget } from '../interfaces/Budget';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

export const fetchBudgets = async (): Promise<Budget[]> => {
  const response = await axios.get(`${API_URL}/budgets/user`, getAuthHeaders());
  console.log(response.data);
  return response.data;
};

export const createBudget = async (budget: Budget): Promise<Budget> => {
  const response = await axios.post(`${API_URL}/budgets`, {
        category: budget.category,
        amount: budget.amount,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        currentSpent: budget.currentSpent,
        description: budget.description,
  }, getAuthHeaders());

  return response.data;
};

export const updateBudget = async (budget: Budget): Promise<Budget> => {
    console.log(budget);
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
  return response.data;
};

export const deleteBudget = async (budgetId: string): Promise<void> => {
    console.log(budgetId);
  await axios.delete(`${API_URL}/budgets/${budgetId}`, getAuthHeaders());
};