import Transaction from '../models/Transaction';
import Category from '../models/Category';
import Account from '../models/Account';
import { ITransaction } from '../types/interfaces/ITransaction';
import mongoose from 'mongoose';
import { updateAccountBalance, revertAccountBalanceUpdate } from './AccountService';
import { updateBudgetOnTransactionCreate, updateBudgetOnTransactionDelete, updateBudgetOnTransactionUpdate } from './BudgetService';
import { TransactionType } from '../types/enums/TransactionType';
import { getTransactionTypeFromCategoryId, getTransactionTypeFromCategoryName } from '../utils/categoryUtils';
import NotificationGatewayService from './NotificationGatewayService';

export const createTransaction = async (transactionData: ITransaction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the transaction
    const transaction = new Transaction(transactionData);
    await transaction.save({ session });

    // Determine transaction type from category
    const transactionType = await getTransactionTypeFromCategoryId(transaction.category.toString());

    // Update account balance
    await updateAccountBalance(
      transaction.account.toString(), 
      transaction.amount, 
      transactionType,
      session
    );

    // Update budget if it's an expense
    if (transactionType === TransactionType.EXPENSE && transaction.budget) {
      await updateBudgetOnTransactionCreate(transaction, session);
    }

    await session.commitTransaction();

    // Get account name for notification
    const account = await Account.findById(transaction.account);
    const accountName = account ? account.name : 'Unknown Account';

    // Create notification outside of transaction
    await NotificationGatewayService.createTransactionCreatedNotification(
      transaction.user.toString(),
      transaction.amount,
      transaction.description || 'No description',
      accountName
    );

    // Check for large expense
    if (transactionType === TransactionType.EXPENSE && transaction.amount > 1000) {
      await NotificationGatewayService.createLargeExpenseWarningNotification(
        transaction.user.toString(),
        transaction.amount,
        transaction.description || 'No description',
        accountName
      );
    }

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getTransactionsByUser = async (userId: string) => {
  return await Transaction.find({ user: userId })
    .populate('account')
    .populate('category')
    .populate('subCategory')
    .populate('budget')
    .sort({ date: -1 }); // Sort by most recent first
};

export const getTransactionById = async (transactionId: string) => {
  return await Transaction.findById(transactionId)
    .populate('account')
    .populate('category')
    .populate('subCategory')
    .populate('budget');
};

export const updateTransactionById = async (transactionId: string, updateData: Partial<ITransaction>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get the existing transaction
    const existingTransaction = await Transaction.findById(transactionId).session(session);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    // Get existing transaction type from its category
    const existingType = await getTransactionTypeFromCategoryId(existingTransaction.category.toString());

    // If account, amount, or category changed, update account balances
    if (updateData.account || updateData.amount !== undefined || updateData.category) {
      // Revert the old transaction's effect on account balance
      await revertAccountBalanceUpdate(
        existingTransaction.account.toString(),
        existingTransaction.amount,
        existingType,
        session
      );
    }

    // Update the transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      updateData,
      { new: true, session }
    );

    if (!updatedTransaction) {
      throw new Error('Failed to update transaction');
    }

    // Get new transaction type if category changed, otherwise use existing type
    const newType = updateData.category ? 
      await getTransactionTypeFromCategoryId(updatedTransaction.category.toString()) : 
      existingType;

    // Apply new transaction's effect on account balance
    if (updateData.account || updateData.amount !== undefined || updateData.category) {
      await updateAccountBalance(
        updatedTransaction.account.toString(),
        updatedTransaction.amount,
        newType,
        session
      );
    }

    // Update budgets if necessary
    await updateBudgetOnTransactionUpdate(existingTransaction, updatedTransaction, session);

    await session.commitTransaction();

    // Get account name for notification
    const account = await Account.findById(updatedTransaction.account);
    const accountName = account ? account.name : 'Unknown Account';

    // Create notification outside of transaction
    await NotificationGatewayService.createTransactionUpdatedNotification(
      updatedTransaction.user.toString(),
      updatedTransaction.amount,
      updatedTransaction.description || 'No description',
      accountName
    );

    return updatedTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deleteTransactionById = async (transactionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await Transaction.findById(transactionId).session(session);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Determine transaction type from category
    const transactionType = await getTransactionTypeFromCategoryId(transaction.category.toString());

    // Update account balance before deleting
    await revertAccountBalanceUpdate(
      transaction.account.toString(),
      transaction.amount,
      transactionType,
      session
    );

    if (transactionType === TransactionType.EXPENSE && transaction.budget) {
      await updateBudgetOnTransactionDelete(transaction, session);
    }


    await Transaction.findByIdAndDelete(transactionId).session(session);

    await session.commitTransaction();

    const account = await Account.findById(transaction.account);
    const accountName = account ? account.name : 'Unknown Account';

    await NotificationGatewayService.createTransactionDeletedNotification(
      transaction.user.toString(),
      transaction.amount,
      transaction.description || 'No description',
      accountName
    );

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getTransactionsSummary = async (userId: string, startDate?: string, endDate?: string) => {
  // Build date filter
  const dateFilter: any = { user: userId };
  if (startDate || endDate) {
    dateFilter.date = {};
    if (startDate) dateFilter.date.$gte = new Date(startDate);
    if (endDate) dateFilter.date.$lte = new Date(endDate);
  }

  const transactions = await Transaction.find(dateFilter)
    .populate('category')
    .populate('subCategory')
    .populate('budget')
    .sort({ date: 1 });

  // Initialize summary structure
  const summary = {
    period: {
      start: startDate ? new Date(startDate).toISOString().split('T')[0] : 'All Time',
      end: endDate ? new Date(endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    },
    income: {
      categories: {} as Record<string, number>,
      total: 0
    },
    expenses: {
      categories: {} as Record<string, number>,
      total: 0
    },
    savings: {
      categories: {} as Record<string, number>,
      total: 0
    },
    investments: {
      categories: {} as Record<string, number>,
      total: 0
    },
    debt: {
      categories: {} as Record<string, number>,
      total: 0
    },
    credit: {
      categories: {} as Record<string, number>,
      total: 0
    },
    netIncome: 0,
    statistics: {
      totalTransactions: transactions.length,
      byDate: {} as Record<string, { count: number, amount: number }>,
      mostActiveDay: '',
      mostUsedCategories: {} as Record<string, string>,
    }
  };

  // Process each transaction
  for (const transaction of transactions) {
    const transactionDate = transaction.date.toISOString().split('T')[0];
    const categoryObj = transaction.category as any;
    const categoryName = categoryObj?.name || 'Uncategorized';
    const subCategoryNames = transaction.subCategory?.map((sub: any) => sub.name).join(', ') || 'General';
    const categoryKey = `${categoryName}${subCategoryNames ? ' - ' + subCategoryNames : ''}`;
    const amount = transaction.amount;

    // Track by date for statistics
    if (!summary.statistics.byDate[transactionDate]) {
      summary.statistics.byDate[transactionDate] = { count: 0, amount: 0 };
    }
    summary.statistics.byDate[transactionDate].count += 1;
    summary.statistics.byDate[transactionDate].amount += amount;

    // Determine transaction type from category
    const transactionType = getTransactionTypeFromCategoryName(categoryName);

    // Categorize based on transaction type
    switch (transactionType) {
      case TransactionType.INCOME:
        if (!summary.income.categories[categoryKey]) {
          summary.income.categories[categoryKey] = 0;
        }
        summary.income.categories[categoryKey] += amount;
        summary.income.total += amount;
        break;

      case TransactionType.EXPENSE:
        if (!summary.expenses.categories[categoryKey]) {
          summary.expenses.categories[categoryKey] = 0;
        }
        summary.expenses.categories[categoryKey] += amount;
        summary.expenses.total += amount;
        break;

      case TransactionType.SAVINGS:
        if (!summary.savings.categories[categoryKey]) {
          summary.savings.categories[categoryKey] = 0;
        }
        summary.savings.categories[categoryKey] += amount;
        summary.savings.total += amount;
        break;

      case TransactionType.INVESTMENT:
        if (!summary.investments.categories[categoryKey]) {
          summary.investments.categories[categoryKey] = 0;
        }
        summary.investments.categories[categoryKey] += amount;
        summary.investments.total += amount;
        break;

      case TransactionType.DEBT:
        if (!summary.debt.categories[categoryKey]) {
          summary.debt.categories[categoryKey] = 0;
        }
        summary.debt.categories[categoryKey] += amount;
        summary.debt.total += amount;
        break;

      case TransactionType.CREDIT:
        if (!summary.credit.categories[categoryKey]) {
          summary.credit.categories[categoryKey] = 0;
        }
        summary.credit.categories[categoryKey] += amount;
        summary.credit.total += amount;
        break;
    }
  }

  // Calculate net income (income - expenses)
  summary.netIncome = summary.income.total - summary.expenses.total;

  // Find most active day - safely handle empty case
  const dateKeys = Object.keys(summary.statistics.byDate);
  summary.statistics.mostActiveDay = dateKeys.length > 0 
    ? dateKeys.reduce((a, b) => summary.statistics.byDate[a].count > summary.statistics.byDate[b].count ? a : b, dateKeys[0])
    : '';

  // Find most used category for each transaction type category
  const typeCategories = {
    'INCOME': summary.income.categories,
    'EXPENSE': summary.expenses.categories,
    'SAVINGS': summary.savings.categories,
    'INVESTMENT': summary.investments.categories,
    'DEBT': summary.debt.categories,
    'CREDIT': summary.credit.categories,
  };

  for (const [type, categories] of Object.entries(typeCategories)) {
    const categoryKeys = Object.keys(categories);
    if (categoryKeys.length > 0) {
      const mostUsedCategory = categoryKeys.reduce(
        (a, b) => categories[a] > categories[b] ? a : b, 
        categoryKeys[0]
      );
      summary.statistics.mostUsedCategories[type] = mostUsedCategory;
    }
  }

  return {
    summary,
    rawTransactions: transactions
  };
};