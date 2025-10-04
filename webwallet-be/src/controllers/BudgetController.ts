import { Request, Response } from 'express';
import * as BudgetService from '../services/BudgetService';
import { validateBudgetInput, validateBudgetUpdateInput } from '../helpers/validators/BudgetValidator';
import mongoose from 'mongoose';
import logger from '../utils/logger';

export const createBudget = async (req: Request, res: Response) => {
  const { error } = validateBudgetInput(req.body);
  if (error) {
    const errorMessages = error.details.map(detail => detail.message).join(', ');
    logger.warn(`Budget validation error: ${errorMessages}`);
    return res.status(400).json({ error: errorMessages });
  }

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    // Validate date range
    const { startDate, endDate, amount, notificationThreshold } = req.body;
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({ error: 'Budget amount must be positive' });
    }

    // Validate notification threshold (0-100)
    if (notificationThreshold < 0 || notificationThreshold > 100) {
      return res.status(400).json({ error: 'Notification threshold must be between 0 and 100' });
    }

    // Validate category exists
    if (!req.body.category || !mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({ error: 'Valid category ID is required' });
    }

    const budgetData = { ...req.body, user: userId };
    
    try {
      const budget = await BudgetService.createBudget(budgetData);
      res.status(201).json(budget);
    } catch (err: any) {
      // Check for duplicate description error
      if (err.message && err.message.includes('already exists')) {
        return res.status(409).json({ error: err.message });
      }
      // Re-throw other errors
      throw err;
    }
  } catch (error: any) {
    logger.error(`Failed to create budget: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getBudgetsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    const budgets = await BudgetService.getBudgetsByUser(userId);
    res.status(200).json(budgets);
  } catch (error: any) {
    logger.error(`Failed to fetch budgets: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    const budgetId = req.params.budgetId;
    if (!budgetId || !mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ error: 'Valid Budget ID is required' });
    }

    const budget = await BudgetService.getBudgetById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    // Verify ownership
    if (budget.user.toString() !== userId) {
      logger.warn(`Unauthorized budget access attempt: User ${userId} tried to access budget ${budgetId}`);
      return res.status(403).json({ error: 'You do not have permission to access this budget' });
    }
    
    res.status(200).json(budget);
  } catch (error: any) {
    logger.error(`Failed to fetch budget: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateBudgetById = async (req: Request, res: Response) => {
  const { error } = validateBudgetUpdateInput(req.body);
  if (error) {
    const errorMessages = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessages });
  }

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    const budgetId = req.params.budgetId;
    if (!budgetId || !mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ error: 'Valid Budget ID is required' });
    }
    
    // Fetch budget to verify ownership before updating
    const existingBudget = await BudgetService.getBudgetById(budgetId);
    if (!existingBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    // Verify ownership
    if (existingBudget.user.toString() !== userId) {
      logger.warn(`Unauthorized budget update attempt: User ${userId} tried to update budget ${budgetId}`);
      return res.status(403).json({ error: 'You do not have permission to modify this budget' });
    }

    // Validate date range if both are provided
    if (req.body.startDate && req.body.endDate) {
      if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
        return res.status(400).json({ error: 'Start date must be before end date' });
      }
    }
    
    // Validate amount is positive if provided
    if (req.body.amount !== undefined && req.body.amount <= 0) {
      return res.status(400).json({ error: 'Budget amount must be positive' });
    }
    
    // Validate notification threshold if provided
    if (req.body.notificationThreshold !== undefined && 
        (req.body.notificationThreshold < 0 || req.body.notificationThreshold > 100)) {
      return res.status(400).json({ error: 'Notification threshold must be between 0 and 100' });
    }

    const updatedBudget = await BudgetService.updateBudgetById(budgetId, req.body);
    res.status(200).json(updatedBudget);
  } catch (error: any) {
    logger.error(`Failed to update budget: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const deleteBudgetById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    const budgetId = req.params.budgetId;
    if (!budgetId || !mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ error: 'Valid Budget ID is required' });
    }
    
    // Fetch budget to verify ownership before deletion
    const budget = await BudgetService.getBudgetById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    // Verify ownership
    if (budget.user.toString() !== userId) {
      logger.warn(`Unauthorized budget deletion attempt: User ${userId} tried to delete budget ${budgetId}`);
      return res.status(403).json({ error: 'You do not have permission to delete this budget' });
    }
    
    // Check if budget has associated transactions
    const hasTransactions = await BudgetService.checkBudgetHasTransactions(budgetId);
    if (hasTransactions) {
      return res.status(400).json({ 
        error: 'Cannot delete budget with associated transactions. Update transactions first.' 
      });
    }

    const deleted = await BudgetService.deleteBudgetById(budgetId);
    if (!deleted) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.status(204).end();
  } catch (error: any) {
    logger.error(`Failed to delete budget: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};