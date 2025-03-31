import { Request, Response } from 'express';
import * as AccountService from '../services/AccountService';
import { validateAccountInput } from '../helpers/validators/AccountValidator';
import { validateAccountUpdateInput } from '../helpers/validators/AccountUpdateValidator';
import mongoose from 'mongoose';
import logger from '../utils/logger';

export const createAccount = async (req: Request, res: Response) => {
  const { error } = validateAccountInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const accountData = { ...req.body, user: userId };
    
    try {
      const account = await AccountService.createAccount(accountData);
      res.status(201).json(account);
    } catch (err: any) {
      // Check for duplicate name error
      if (err.message && err.message.includes('already exists')) {
        return res.status(409).json({ error: err.message });
      }
      // Re-throw other errors
      throw err;
    }
  } catch (error: any) {
    logger.error(`Failed to create account: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getAccountsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const accounts = await AccountService.getAccountsByUser(userId);
    res.status(200).json(accounts);
  } catch (error: any) {
    logger.error(`Failed to fetch accounts: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const accountId = req.params.accountId;
    if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Valid Account ID is required' });
    }

    const account = await AccountService.findById(accountId);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    
    // Verify ownership
    if (account.user.toString() !== userId) {
      return res.status(403).json({ error: 'You do not have permission to access this account' });
    }
    
    res.status(200).json(account);
  } catch (error: any) {
    logger.error(`Failed to fetch account: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateAccountBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const accountId = req.params.accountId;
    if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Valid Account ID is required' });
    }
    
    // Validate amount
    const { amount } = req.body;
    if (amount === undefined || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const existingAccount = await AccountService.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    // Verify ownership
      let accountOwnerId: string;
      
      if (existingAccount.user && typeof existingAccount.user === 'object') {
           const userObj = existingAccount.user as any;
           accountOwnerId = userObj._id ? userObj._id.toString() : userObj.toString();
      } else {
          accountOwnerId = String(existingAccount.user);
      }
    
    if (accountOwnerId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to update this account' });
    }

    const account = await AccountService.directUpdateAccountBalance(accountId, amount);
    res.status(200).json(account);
  } catch (error: any) {
    logger.error(`Failed to update account balance: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateAccountById = async (req: Request, res: Response) => {
  const { error } = validateAccountUpdateInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const accountId = req.params.accountId;
    if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Valid Account ID is required' });
    }

    // Verify ownership
    const existingAccount = await AccountService.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    // Verify ownership
    let accountOwnerId: string;
      
    if (existingAccount.user && typeof existingAccount.user === 'object') {
         const userObj = existingAccount.user as any;
         accountOwnerId = userObj._id ? userObj._id.toString() : userObj.toString();
    } else {
        accountOwnerId = String(existingAccount.user);
    }
  
  if (accountOwnerId !== userId) {
    return res.status(403).json({ error: 'You do not have permission to update this account' });
  }

    const account = await AccountService.updateAccountById(accountId, req.body);
    res.status(200).json(account);
  } catch (error: any) {
    logger.error(`Failed to update account: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const deleteAccountById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const accountId = req.params.accountId;
    if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Valid Account ID is required' });
    }

    // Verify ownership before deletion
    const existingAccount = await AccountService.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    // Fix: Use consistent ownership verification pattern
    let accountOwnerId: string;
      
    if (existingAccount.user && typeof existingAccount.user === 'object') {
         const userObj = existingAccount.user as any;
         accountOwnerId = userObj._id ? userObj._id.toString() : userObj.toString();
    } else {
        accountOwnerId = String(existingAccount.user);
    }
  
    if (accountOwnerId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this account' });
    }

    // Check if account has associated transactions
    const hasTransactions = await AccountService.checkAccountHasTransactions(accountId);
    if (hasTransactions) {
      return res.status(400).json({ 
        error: 'Cannot delete account with associated transactions. Transfer or delete transactions first.' 
      });
    }

    const account = await AccountService.deleteAccountById(accountId);
    res.status(204).end();
  } catch (error: any) {
    logger.error(`Failed to delete account: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};