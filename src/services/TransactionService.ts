import Transaction from '../models/Transaction';
import { ITransaction } from '../types/interfaces/ITransaction';

export const createTransaction = async (transactionData: ITransaction) => {
  const transaction = new Transaction(transactionData);
  return await transaction.save();
};

export const getTransactionsByUser = async (userId: string) => {
  return await Transaction.find({ user: userId }).populate('account category subcategory');
};

export const updateTransactionById = async (transactionId: string, updateData: Partial<ITransaction>) => {
  return await Transaction.findByIdAndUpdate(transactionId, updateData, { new: true });
};

export const deleteTransactionById = async (transactionId: string) => {
  return await Transaction.findByIdAndDelete(transactionId);
};