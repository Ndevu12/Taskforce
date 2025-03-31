import Account from '../models/Account';
import Transaction from '../models/Transaction';
import { IAccount } from '../types/interfaces/IAccount';
import { TransactionType } from '../types/enums/TransactionType';
import mongoose from 'mongoose';
import logger from '../utils/logger';
import { AccountType } from '../types/enums/AccountType';
import { getTransactionTypeFromCategoryId } from '../utils/categoryUtils';
import NotificationGatewayService from './NotificationGatewayService';

export const createAccount = async (accountData: IAccount) => {
  // Check if account with same name already exists for this user
  const existingAccount = await Account.findOne({
    name: accountData.name,
    user: accountData.user
  });
  
  if (existingAccount) {
    throw new Error(`An account with the name "${accountData.name}" already exists`);
  }
  
  const account = new Account(accountData);
  const savedAccount = await account.save();
  
  if (savedAccount) {
  await NotificationGatewayService.createAccountCreatedNotification(
    savedAccount.user.toString(),
    savedAccount.name
  );
}
  
  return savedAccount;
};

export const getAccountsByUser = async (userId: string) => {
  return await Account.find({ user: userId })
    .populate({
      path: 'user',
      select: 'name email'
    })
    .sort({ updatedAt: -1 });
};

export const updateAccountBalanceByTransactionId = async (accountId: string, amount: number, transactionType: TransactionType) => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error('Account not found. Balance update has been failed.');
  }
  
  // Calculate new balance based on transaction type
  let newBalance = account.balance;
  if (transactionType === TransactionType.INCOME || 
      transactionType === TransactionType.CREDIT || 
      transactionType === TransactionType.SAVINGS || 
      transactionType === TransactionType.INVESTMENT) {
    newBalance += amount;
  } else if (transactionType === TransactionType.EXPENSE || 
             transactionType === TransactionType.DEBT) {
    // Prevent negative balance unless it's a credit account type
    if (account.balance < amount && account.type !== 'CREDIT') {
      throw new Error('Insufficient balance for this transaction');
    }
    newBalance -= amount;
  }
  
  const updatedAccount = await Account.findByIdAndUpdate(
    accountId, 
    { balance: newBalance }, 
    { new: true }
  );
  
  return updatedAccount;
};

export const updateAccountBalance = async (
  accountId: string, 
  amount: number, 
  transactionType: TransactionType, 
  session?: mongoose.ClientSession
) => {
  const account = session 
    ? await Account.findById(accountId).session(session)
    : await Account.findById(accountId);
    
  if (!account) {
    throw new Error('Account not found');
  }

  // Store original balance for comparison
  const originalBalance = account.balance;
  
  // Update balance based on transaction type
  if (transactionType === TransactionType.EXPENSE || 
      transactionType === TransactionType.DEBT) {
    // Prevent negative balance unless it's a credit account type
    if (account.balance < amount && account.type !== AccountType.CREDIT) {
      throw new Error('Insufficient balance for this transaction');
    }
    account.balance -= amount;
  } else if (transactionType === TransactionType.INCOME || 
            transactionType === TransactionType.CREDIT || 
            transactionType === TransactionType.SAVINGS || 
            transactionType === TransactionType.INVESTMENT) {
    account.balance += amount;
  }

  try {
    const savedAccount = session 
      ? await account.save({ session }) 
      : await account.save();
      
    if (!session) {

      const significantAmountThreshold = 500;
      const significantPercentageThreshold = 0.2;
      const isSignificantAmount = amount > significantAmountThreshold;
      const isSignificantPercentage = amount > (Math.abs(originalBalance) * significantPercentageThreshold);
      
      if (isSignificantAmount || isSignificantPercentage) {
        const isDeposit = transactionType === TransactionType.INCOME || 
                         transactionType === TransactionType.CREDIT || 
                         transactionType === TransactionType.SAVINGS || 
                         transactionType === TransactionType.INVESTMENT;

        await NotificationGatewayService.createSignificantBalanceChangeNotification(
          savedAccount.user.toString(),
          savedAccount.name,
          amount,
          isDeposit
        );
      }
    }
    
    return savedAccount;
  } catch (error) {
    logger.error(`Failed to update account balance: ${error}`);
    throw new Error('Failed to update account balance');
  }
};

export const revertAccountBalanceUpdate = async (
  accountId: string, 
  amount: number, 
  transactionType: string | TransactionType, 
  session?: mongoose.ClientSession
) => {
  const typeToRevert = typeof transactionType === 'string' 
    ? transactionType as TransactionType
    : transactionType;

  return await updateAccountBalance(
    accountId, 
    amount, 
    typeToRevert === TransactionType.EXPENSE || typeToRevert === TransactionType.DEBT 
      ? TransactionType.INCOME 
      : TransactionType.EXPENSE,
    session
  );
};

export const updateAccountById = async (accountId: string, updateData: Partial<IAccount>) => {
  // Don't allow direct updates to balance via this method
  const { balance, ...safeUpdateData } = updateData;
  
  const updatedAccount = await Account.findByIdAndUpdate(
    accountId, 
    safeUpdateData, 
    { new: true }
  );
  
  if (updatedAccount) {
    await NotificationGatewayService.createAccountUpdatedNotification(
      updatedAccount.user.toString(),
      updatedAccount.name
    );
  }
  
  return updatedAccount;
};

export const findById = async (accountId: string) => {
  return await Account.findById(accountId).populate({
    path: 'user',
    select: 'name email'
  });
};

export const deleteAccountById = async (accountId: string) => {
  const deletedAccount = await Account.findByIdAndDelete(accountId);
  
  if (deletedAccount) {
    await NotificationGatewayService.createAccountDeletedNotification(
      deletedAccount.user.toString(),
      deletedAccount.name
    );
  }
  
  return deletedAccount;
};

/**
 * Direct update account balance (used for manual adjustments)
 * This is different from transaction-based updates
 */
export const directUpdateAccountBalance = async (accountId: string, amount: number) => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }
  
  // Store original balance
  const originalBalance = account.balance;
  const balanceChange = Math.abs(amount - originalBalance);
  
  account.balance = amount;
  const updatedAccount = await account.save();
 
  // Create notification for significant manual balance adjustments (over $500 or 20% change)
  const significantAmountThreshold = 500;
  const significantPercentageThreshold = 0.2;
  const isSignificantAmount = balanceChange > significantAmountThreshold;
  const isSignificantPercentage = balanceChange > (Math.abs(originalBalance) * significantPercentageThreshold);
  
  if (isSignificantAmount || isSignificantPercentage) {
    const isDeposit = amount > originalBalance;
    
    await NotificationGatewayService.createSignificantBalanceChangeNotification(
      updatedAccount.user.toString(),
      updatedAccount.name,
      balanceChange,
      isDeposit
    );
  }
  
  return updatedAccount;
};

/**
 * Check if account has any associated transactions
 */
export const checkAccountHasTransactions = async (accountId: string): Promise<boolean> => {
  const transactionCount = await Transaction.countDocuments({ account: accountId });
  return transactionCount > 0;
};

/**
 * Check if account has sufficient balance for a transaction
 */
export const hasSufficientBalance = async (accountId: string, amount: number): Promise<boolean> => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }
  
  // Credit accounts can go negative
  if (account.type === AccountType.CREDIT) {
    return true;
  }
  
  return account.balance >= amount;
};

/**
 * Get account balance history
 */
export const getAccountBalanceHistory = async (accountId: string, days = 30) => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const transactions = await Transaction.find({
    account: accountId,
    date: { $gte: startDate }
  }).populate('category').sort({ date: 1 });
  
  // Calculate running balance
  let runningBalance = account.balance;
  const balanceHistory = await Promise.all(transactions.map(async transaction => {
    // Get transaction type from category
    const categoryId = transaction.category.toString();
    const transactionType = await getTransactionTypeFromCategoryId(categoryId);
    
    if (transactionType === TransactionType.EXPENSE || transactionType === TransactionType.DEBT) {
      runningBalance += transaction.amount; // Add back the expense to get previous balance
    } else {
      runningBalance -= transaction.amount; // Subtract income to get previous balance
    }
    
    const point = {
      date: transaction.date,
      balance: runningBalance,
      transactionAmount: transaction.amount,
      transactionType
    };
    
    return point;
  }));
  
  // Reverse to get chronological order
  balanceHistory.reverse();
  
  // Add current balance as last point
  balanceHistory.push({
    date: new Date(),
    balance: account.balance,
    transactionAmount: 0,
    transactionType: TransactionType.NONE
  });
  
  return balanceHistory;
};
