import Budget from '../models/Budget';
import { IBudget } from '../types/interfaces/IBudget';

export const createBudget = async (budgetData: IBudget) => {
  const budget = new Budget(budgetData);
  return await budget.save();
};

export const getBudgetsByUser = async (userId: string) => {
  return await Budget.find({ user: userId });
};

export const updateBudgetById = async (budgetId: string, updateData: Partial<IBudget>) => {
  return await Budget.findByIdAndUpdate(budgetId, updateData, { new: true });
};

export const deleteBudgetById = async (budgetId: string) => {
  return await Budget.findByIdAndDelete(budgetId);
};