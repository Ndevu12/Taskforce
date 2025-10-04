import { Request, Response } from 'express';
import * as TransactionService from '../services/TransactionService';
import { validateTransactionInput, validateTransactionUpdateInput } from '../helpers/validators/TransactionValidator';
import logger from '../utils/logger';
import { checkBudgetExceedForTransaction } from '../services/BudgetService';
import { getCategoryByName, getCategoryById } from '../services/CategoryService';
import { TransactionType } from '../types/enums/TransactionType';
import * as UserService from '../services/UserService';
import * as AccountService from '../services/AccountService';
import mongoose from 'mongoose';
import { getTransactionTypeFromCategoryId } from '../utils/categoryUtils';

export const createTransaction = async (req: Request, res: Response) => {
  const { error } = validateTransactionInput(req.body);
  if (error) {
    logger.info(`Transaction validation error: ${error.details[0].message}`);
    // Format all validation errors
    const errorMessages = error.details.map(detail => detail.message).join('; ');
    logger.info(`Transaction validation error: ${errorMessages}`);
    return res.status(400).json({ error: errorMessages });
  }

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    // Log the user ID and account ID for debugging
    logger.info(`Creating transaction for user: ${userId}, account: ${req.body.account}`);

    // Verify account belongs to user
    const account = await AccountService.findById(req.body.account);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Extract account owner ID correctly - handle both populated and unpopulated cases
    let accountOwnerId: string;
    
    // Type check and safely extract the owner ID
    if (account.user && typeof account.user === 'object') {
      // Handle populated user object
      const userObj = account.user as any;
      accountOwnerId = userObj._id ? userObj._id.toString() : userObj.toString();
    } else {
      accountOwnerId = String(account.user);
    }

    if (accountOwnerId !== userId.toString()) {
      return res.status(403).json({ error: 'You do not have permission to use this account' });
    }

    // Get category by name or id
    let category;
    if (typeof req.body.category === 'string') {
      // If provided a name or ID, look it up
      if (mongoose.Types.ObjectId.isValid(req.body.category)) {
        category = await getCategoryById(req.body.category);
      } else {
        category = await getCategoryByName(req.body.category);
      }
    }
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Determine transaction type from category
    const transactionType = await getTransactionTypeFromCategoryId((category._id as mongoose.Types.ObjectId).toString());

    // If it's an expense transaction, ensure budget is specified
    if (transactionType === TransactionType.EXPENSE && !req.body.budget) {
      logger.info(`Budget is required for expense transactions: ${JSON.stringify(req.body)}`);
      return res.status(400).json({ error: 'Budget is required for expense transactions' });
    }

    // Pre-validate sufficient balance for expense or debt transactions
    if ([TransactionType.EXPENSE, TransactionType.DEBT].includes(transactionType)) {
      // Check if account type is not CREDIT and has sufficient balance
      if (account.type !== 'CREDIT' && account.balance < req.body.amount) {
        logger.warn(`Insufficient balance for transaction. Account: ${account._id}, Balance: ${account.balance}, Amount: ${req.body.amount}`);
        return res.status(400).json({ 
          error: 'Insufficient balance for this transaction',
          details: {
            accountName: account.name,
            currentBalance: account.balance,
            requiredAmount: req.body.amount,
            deficit: req.body.amount - account.balance
          }
        });
      }
    }

    const transactionData = { ...req.body, user: userId, category: category._id };
    const transaction = await TransactionService.createTransaction(transactionData);

    // Check if budget exceeded and return notification
    if (transactionType === TransactionType.EXPENSE) {
      const budgetExceededNotification = await checkBudgetExceedForTransaction(transaction);
      if (budgetExceededNotification) {
        return res.status(201).json({ 
          transaction, 
          notification: budgetExceededNotification 
        });
      }
    }

    res.status(201).json(transaction);
  } catch (error: any) {
    // Handle specific error types with appropriate status codes
    if (error.message?.includes('Insufficient balance')) {
      logger.warn(`Transaction failed: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    
    logger.error(`Failed to create transaction: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const transactions = await TransactionService.getTransactionsByUser(userId);
    
    // Calculate transaction summary statistics
    let totalIncome = 0;
    let totalExpenses = 0;
    
    for (const transaction of transactions) {
      // Get category name and determine transaction type
      const categoryObj = transaction.category as any;
      const categoryName = categoryObj?.name || '';
      
      // Determine transaction type from category name
      if (categoryName.toUpperCase() === 'INCOME') {
        totalIncome += transaction.amount;
      } else if (categoryName.toUpperCase() === 'EXPENSE') {
        totalExpenses += transaction.amount;
      }
    }
    
    // Calculate net amount
    const netAmount = totalIncome - totalExpenses;
    
    // Return both transactions and summary statistics
    res.status(200).json({
      transactions,
      summary: {
        totalTransactions: transactions.length,
        totalIncome,
        totalExpenses,
        netAmount
      }
    });
  } catch (error: any) {
    logger.error(`Failed to fetch transactions: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateTransactionById = async (req: Request, res: Response) => {
  const { error } = validateTransactionUpdateInput(req.body);
  if (error) {
    // Format all validation errors
    const errorMessages = error.details.map(detail => detail.message).join('; ');
    return res.status(400).json({ error: errorMessages });
  }

  try {
    const transactionId = req.params.transactionId;
    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ error: 'Valid Transaction ID is required' });
    }

    const existingTransaction = await TransactionService.getTransactionById(transactionId);
    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Verify user owns this transaction
    if (existingTransaction.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'You do not have permission to update this transaction' });
    }

    // If category is being updated, get category and check type
    let newTransactionType = undefined;
    if (req.body.category) {
      let newCategory;
      if (mongoose.Types.ObjectId.isValid(req.body.category)) {
        newCategory = await getCategoryById(req.body.category);
      } else {
        newCategory = await getCategoryByName(req.body.category);
      }
      
      if (!newCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }

      req.body.category = newCategory._id;
      newTransactionType = await getTransactionTypeFromCategoryId((newCategory._id as mongoose.Types.ObjectId).toString());
      
      // If changing to an expense type, ensure budget is provided
      if (newTransactionType === TransactionType.EXPENSE && !req.body.budget && !existingTransaction.budget) {
        return res.status(400).json({ error: 'Budget is required for expense transactions' });
      }
    }

    // If account is being updated, verify it belongs to the user
    if (req.body.account) {
      const account = await AccountService.findById(req.body.account);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      let accountOwnerId: string;
      
      if (account.user && typeof account.user === 'object') {
        const userObj = account.user as any;
        accountOwnerId = userObj._id ? userObj._id.toString() : userObj.toString();
      } else {
        accountOwnerId = String(account.user);
      }

      if (accountOwnerId !== req.userId) {
        return res.status(403).json({ error: 'You do not have permission to use this account' });
      }
    }

    const transaction = await TransactionService.updateTransactionById(transactionId, req.body);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    // Check if budget exceeded after update
    const transactionType = newTransactionType || await getTransactionTypeFromCategoryId(transaction.category.toString());
    if (transactionType === TransactionType.EXPENSE) {
      const budgetExceededNotification = await checkBudgetExceedForTransaction(transaction);
      if (budgetExceededNotification) {
        return res.status(200).json({ 
          transaction, 
          notification: budgetExceededNotification 
        });
      }
    }

    res.status(200).json(transaction);
  } catch (error: any) {
    logger.error(`Failed to update transaction: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;
    if (!transactionId) return res.status(400).json({ error: 'Transaction ID is required' });

    const transaction = await TransactionService.getTransactionById(transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    
    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteTransactionById = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;
    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ error: 'Valid Transaction ID is required' });
    }
    
    // First fetch to verify ownership
    const transaction = await TransactionService.getTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Verify user owns this transaction
    if (transaction.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this transaction' });
    }
    
    await TransactionService.deleteTransactionById(transactionId);
    res.status(204).end();
  } catch (error: any) {
    logger.error(`Failed to delete transaction: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    // Don't use params.userId which could allow accessing other users' data
    // Instead, use the authenticated user's ID
    
    // Extract date range from query parameters
    const { startDate, endDate } = req.query;
    
    const summary = await TransactionService.getTransactionsSummary(
      userId, 
      startDate as string | undefined, 
      endDate as string | undefined
    );
    
    res.status(200).json(summary);
  } catch (error: any) {
    logger.error(`Failed to generate transaction summary: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate transaction summary' });
  }
};
