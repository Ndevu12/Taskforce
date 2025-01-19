import Account from '../models/Account';
import { IAccount } from '../types/interfaces/IAccount';
import { TransactionType } from '../types/enums/TransactionType';
import { io } from '../app';

export const createAccount = async (accountData: IAccount) => {
  const account = new Account(accountData);
  return await account.save();
};

export const getAccountsByUser = async (userId: string) => {
  return await Account.find({ user: userId });
};

export const updateAccountBalanceByTransactionId = async (accountId: string, amount: number, transactionType: TransactionType) => {
  const account = await Account.findById(accountId);
  if (account) {
    const newBalance = transactionType === TransactionType.INCOME 
      ? account.balance + amount 
      : account.balance - amount;
    const updatedAccount = await Account.findByIdAndUpdate(accountId, { balance: newBalance }, { new: true });
    io.emit('accountBalanceUpdated', updatedAccount);
    return updatedAccount;
  }
  throw new Error('Account not found. Balance update has been failed.');
};

export const updateAccountBalance = async (accountId: string, amount: number) => {
  const updatedAccount = await Account.findByIdAndUpdate(accountId, { balance: amount }, { new: true });
  io.emit('accountBalanceUpdated', updatedAccount);
  return updatedAccount;
};

export const updateAccountById = async (accountId: string, updateData: Partial<IAccount>) => {
  return await Account.findByIdAndUpdate(accountId, updateData, { new: true });
};

export const findById = async (accountId: string) => {
  return await Account.findById(accountId);
}

export const deleteAccountById = async (accountId: string) => {
  return await Account.findByIdAndDelete(accountId);
};
