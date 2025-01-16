import { Request, Response } from 'express';
import * as AccountService from '../services/AccountService';
import { validateAccountInput } from '../helpers/validators/AccountValidator';
import { validateAccountUpdateInput } from '../helpers/validators/AccountUpdateValidator';

export const createAccount = async (req: Request, res: Response) => {
  const { error } = validateAccountInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const accountData = { ...req.body, user: userId };
    const account = await AccountService.createAccount(accountData);
    res.status(201).json(account);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAccountsByUser = async (req: Request, res: Response) => {
  try {
    const accounts = await AccountService.getAccountsByUser(req.params.userId);
    res.status(200).json(accounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAccountBalance = async (req: Request, res: Response) => {
  try {
    const account = await AccountService.updateAccountBalance(req.params.accountId, req.body.amount);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.status(200).json(account);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAccountById = async (req: Request, res: Response) => {
  const { error } = validateAccountUpdateInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const account = await AccountService.updateAccountById(req.params.accountId, req.body);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.status(200).json(account);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAccountById = async (req: Request, res: Response) => {
  try {
    const account = await AccountService.deleteAccountById(req.params.accountId);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};