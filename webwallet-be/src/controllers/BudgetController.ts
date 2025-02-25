import { Request, Response } from 'express';
import * as BudgetService from '../services/BudgetService';
import { validateBudgetInput, validateBudgetUpdateInput } from '../helpers/validators/BudgetValidator';

export const createBudget = async (req: Request, res: Response) => {
  const { error } = validateBudgetInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const budgetData = { ...req.body, user: req.userId };
    const budget = await BudgetService.createBudget(budgetData);
    res.status(201).json(budget);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBudgetsByUser = async (req: Request, res: Response) => {
  try {
    const id = req.userId;
    if (!id) return res.status(401).json({ error: 'User not authorized' });
    
    const budgets = await BudgetService.getBudgetsByUser(id);
    res.status(200).json(budgets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBudgetById = async (req: Request, res: Response) => {
  const { error } = validateBudgetUpdateInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const budget = await BudgetService.updateBudgetById(req.params.budgetId, req.body);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.status(200).json(budget);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBudgetById = async (req: Request, res: Response) => {
  try {
    const budget = await BudgetService.deleteBudgetById(req.params.budgetId);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};