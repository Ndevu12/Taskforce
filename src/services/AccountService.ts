import Account from '../models/Account';
import { IAccount } from '../types/interfaces/IAccount';

export const createAccount = async (accountData: IAccount) => {
  const account = new Account(accountData);
  return await account.save();
};

export const getAccountsByUser = async (userId: string) => {
  return await Account.find({ user: userId });
};

export const updateAccountBalance = async (accountId: string, amount: number) => {
  return await Account.findByIdAndUpdate(accountId, { $inc: { balance: amount } }, { new: true });
};

export const updateAccountById = async (accountId: string, updateData: Partial<IAccount>) => {
  return await Account.findByIdAndUpdate(accountId, updateData, { new: true });
};

export const deleteAccountById = async (accountId: string) => {
  return await Account.findByIdAndDelete(accountId);
};
