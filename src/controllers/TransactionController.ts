import { Request, Response } from 'express';
import * as TransactionService from '../services/TransactionService';
import { validateTransactionInput } from '../helpers/validators/TransactionValidator';

export const createTransaction = async (req: Request, res: Response) => {
  const { error } = validateTransactionInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const transaction = await TransactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsByUser = async (req: Request, res: Response) => {
  try {
    const transactions = await TransactionService.getTransactionsByUser(req.params.userId);
    res.status(200).json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTransactionById = async (req: Request, res: Response) => {
  const { error } = validateTransactionInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const transaction = await TransactionService.updateTransactionById(req.params.transactionId, req.body);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
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
