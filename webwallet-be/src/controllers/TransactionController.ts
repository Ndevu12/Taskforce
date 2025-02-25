import { Request, Response } from 'express';
import * as TransactionService from '../services/TransactionService';
import { validateTransactionInput, validateTransactionUpdateInput } from '../helpers/validators/TransactionValidator';
import logger from '../utils/logger';
import { checkBudgetExceedForTransaction, updateBudgetOnTransactionCreate, updateBudgetOnTransactionUpdate } from '../services/BudgetService';
import { getTransactionById } from '../services/TransactionService';
import { getCategoryByName } from '../services/CategoryService';

export const createTransaction = async (req: Request, res: Response) => {
  const { error } = validateTransactionInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const categoryName = req.body.category;
    const category = await getCategoryByName(categoryName);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const transactionData = { ...req.body, user: userId, category: category._id };
    const transaction = await TransactionService.createTransaction(transactionData);
    
  // Update total spent on related budget
  if (transactionData.type === 'EXPENSE') {
    await updateBudgetOnTransactionCreate(transaction );
  }

    if (transaction.type === 'EXPENSE') {
      await checkBudgetExceedForTransaction(transaction);
    }
    res.status(201).json(transaction);
  } catch (error: any) {
    logger.error(`Failed to create transaction: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const transactions = await TransactionService.getTransactionsByUser(userId);
    res.status(200).json(transactions);
  } catch (error: any) {
    logger.error(`Failed to fetch transactions: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateTransactionById = async (req: Request, res: Response) => {
  const { error } = validateTransactionUpdateInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const transactionId = req.params.transactionId;
    if (!transactionId) return res.status(400).json({ error: 'Transaction ID is required' });

    const existingTransaction = await getTransactionById(transactionId);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }
      
    const transaction = await TransactionService.updateTransactionById(transactionId, req.body);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    // Update total spent on related budget
    if (transaction) {
      await updateBudgetOnTransactionUpdate(existingTransaction, transaction);
    }
    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTransactionById = async (req: Request, res: Response) => {
  try {
    const transaction = await TransactionService.deleteTransactionById(req.params.transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const summary = await TransactionService.getTransactionsSummary(userId);
    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
